package team.bham.domain.enumeration;

/**
 * The Color enumeration.
 */
public enum Color {
    RED, //#BC243C
    ORANGE,
    YELLOW,
    GREEN,
    BLUE, //#34568B
    PURPLE,
    PINK,
    OPTIONAL;

    @Override
    public String toString() {
        switch (this) {
            case RED:
                return "Red";
            case ORANGE:
                return "Orange";
            case YELLOW:
                return "Yellow";
            case GREEN:
                return "Green";
            case BLUE:
                return "Blue";
            case PURPLE:
                return "Purple";
            case PINK:
                return "Pink";
            default:
                return "Optional";
        }
    }
}
