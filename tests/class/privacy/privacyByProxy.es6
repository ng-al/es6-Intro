// Copyright (c) Alvin Pivowar 2016

describe("privacy-by-proxy", () => {

    class PasswordService {
        getPasswordComplexity(password) {
            let score = 0;
            if (password && password.length >= 6) score += 10;
            if (password && password.length >= 8) ++score;

            if (/[a-z]/.test(password)) ++score;
            if (/[A-Z]/.test(password)) ++score;
            if (/[0-9]/.test(password)) ++score;
            if (/^a-zA-Z0-9/.test(password)) ++ score;

            return score;
        }
    }

    /*
        The intent is that internally, our pretend library has full access to all of the properties and functions
        of the Username class.  But we want to restrict access to other developers.

        Public interface:
            1.  Must construct with a proper username/password.
            2.  Can get username
            3.  Can change password.
            4.  Can get password complexity.
            5.  NO access to _username, _password, or _service.
     */
    class Username {
        constructor(username, password) {
            this._username = username;
            this._password = password;

            this._service = new PasswordService();

            if (new.target && new.target.name === "Username") {
                if (!username) throw new Error("username is required");
                if (!password) throw new Error("password is required");
                if (this.getPasswordComplexity() < 13)
                    throw new Error("password does not meet complexity requirements");

                return new Proxy(this, new JsonSchemaHandler({
                    properties: {
                        changePassword: "function",
                        getPasswordComplexity: "function",
                        username: "function"
                    }
                }));
            }
        }

        get username() { return this._username; }

        // Normally, you would NOT use lambda definitions for the public methods of a class.
        // I am doing so here, so that the 'this' within the lambda, is a reference to the non-proxy
        // wrapped instance of the class.

        changePassword = newPassword => {
            if (this._service.getPasswordComplexity(newPassword) < 13)
                throw new Error("password does not meet complexity requirements");
            this._password = newPassword;
        };

        getPasswordComplexity = λ => this._service.getPasswordComplexity(this._password);
    }

    it("internal-username-tests", () => {
        class InternalUsername extends Username {}

        // Create object with no username/password.
        let internalUsername = new InternalUsername();
        expect(internalUsername.username).toBeUndefined();
        expect(internalUsername._password).toBeUndefined();

        // Create a username/password that does not match complexity requirements.
        internalUsername = new InternalUsername("Moe", "password");
        expect(internalUsername.username).toBe("Moe");
        expect(internalUsername._password).toBe("password");
        expect(internalUsername.getPasswordComplexity()).toBe(12);

        // Can access internal _ properties.
        expect(λ => internalUsername.changePassword("password")).toThrow();
        internalUsername._password = "bad";
        expect(internalUsername._password).toBe("bad");
    });

    it("public-username-tests", () => {
        expect(λ => new Username()).toThrow();
        expect(λ => new Username("Moe", "password")).toThrow();

        let publicUsername = new Username("Moe", "P@ssw0rd1");
        expect(publicUsername.username).toBe("Moe");
        expect(publicUsername._password).toBeUndefined();
        expect(publicUsername.getPasswordComplexity()).toBe(14);

        expect(λ => publicUsername.changePassword("password")).toThrow();
    })
});