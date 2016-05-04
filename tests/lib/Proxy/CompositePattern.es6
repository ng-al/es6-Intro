// Copyright (c) Alvin Pivowar 2016

describe("composite-pattern-proxy", () => {
    // A color has a name and a RGB value.
    class Color {
        constructor(name, r, g, b) {
            this.name = name;
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    const colorList = [
        new Color("Brown", 0xA5, 0x2A, 0x2A),
        new Color("Chocolate", 0xD2, 0x69, 0x1E),
        new Color("Coral", 0xFF, 0x7F, 0x50),
        new Color("Crimson", 0xDC, 0x14, 0x3C),
        new Color("DarkRed", 0x8B, 0x00, 0x00),
        new Color("DeepPink", 0xFF, 0x14, 0x93),
        new Color("FireBrick", 0xB2, 0x22, 0x22),
        new Color("Fuchsia", 0xFF, 0x00, 0xFF),
        new Color("GotPink", 0xFF, 0x69, 0xB4),
        new Color("IndianRed", 0xCD, 0x5C, 0x5C),
        new Color("LightCoral", 0xF0, 0x80, 0x80),
        new Color("LightPink", 0xFF, 0xB6, 0xC1),
        new Color("LightSalmon", 0xFF, 0xA0, 0x7A),
        new Color("MediumVioletRed", 0xC7, 0x15, 0x85),
        new Color("MistyRose", 0xFF, 0xE4, 0xE1),
        new Color("OrangeRed", 0xFF, 0x45, 0x00),
        new Color("PaleVioletRed", 0xDB, 0x70, 0x93),
        new Color("Red", 0xFF, 0x00, 0x00),
        new Color("Salmon", 0xFA, 0x80, 0x72),
        new Color("Sienna", 0xA0, 0x52, 0x2D),
        new Color("Tomato", 0xFF, 0x63, 0x47),
        new Color("Violet", 0xEE, 0x82, 0xEE)
    ];

    // An "interface" for filtering.
    class IFilter {
        constructor() {
            if (new.target === "IFilter")
                throw new Error("Cannot construct interfaces.");
            if (typeof(this.accept) !== "function")
                throw new Error("bool accept(item) not implemented.")
        }
    }

    // Given a set of colors and a filter, return the list of color names that satisfy the filter.
    const colorFilterService = (colors, filter) => colors.filter(color => filter.accept(color)).map(color => color.name);

    // A filter that selects "red" colors.
    // A red color is defined as a color whose R component is greater than twice the G and B components combined.
    class RedFilter extends IFilter {
        accept(color) {
            return color.r > 2 * (color.g + color.b);
        }
    }


    it("red-filter-test", () => {
        let redColors = colorFilterService(colorList, new RedFilter());
        expect(redColors).toEqual(["Crimson", "DarkRed", "FireBrick", "OrangeRed", "Red"]);
    });

    // A filter that selects light colors.
    class LightFilter extends IFilter {
        accept(color) {
            const brightness = (r, g, b) => Math.sqrt(.241 * r * r + .691 * g * g + .068 * b * b);

            return brightness(color.r, color.g, color.b) > 120;
        }
    }

    it("light-filter-test", () => {
        let lightColors = colorFilterService(colorList, new LightFilter());
        expect(lightColors).toEqual(['Chocolate', 'Coral', 'DeepPink', 'Fuchsia', 'GotPink', 'IndianRed', 'LightCoral',
            'LightPink', 'LightSalmon', 'MistyRose', 'OrangeRed', 'PaleVioletRed', 'Red', 'Salmon', 'Tomato', 'Violet']);
    });

    // Now the Problem:
    // We want to use the color filter service to filter light red colors.
    // But the service only accepts a single service.
    // We COULD create a new filter that combines the functionality of the red and light filters
    // (but we don't want to do THAT.)
    //
    // So we will use the Composite Pattern.
    // A composite color filter ISA filter: it implements accept()
    // but HASA collection of filters.
    // Since we want to filter by red AND lightness, we will create a conjunctive (AND) composite.

    // The ConjunctiveCompositePattern is defined in samples/ConjunctiveCompositePattern.es6

    it("composite-test-add", () => {
        let filter = new Proxy({}, new ConjunctionCompositePattern("accept"));
        filter.add(new RedFilter());
        filter.add(new LightFilter());

        let lightRedColors = colorFilterService(colorList, filter);
        expect(lightRedColors).toEqual(["OrangeRed", "Red"]);
    });

    it("composite-test-target", () => {
        let filter = new Proxy([new RedFilter(), new LightFilter()], new ConjunctionCompositePattern("accept"));

        let lightRedColors = colorFilterService(colorList, filter);
        expect(lightRedColors).toEqual(["OrangeRed", "Red"]);
    });
});