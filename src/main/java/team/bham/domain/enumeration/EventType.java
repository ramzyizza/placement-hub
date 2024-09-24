package team.bham.domain.enumeration;

/**
 * The EventType enumeration.
 */
public enum EventType {
    NORMAL,
    INTERVIEW,
    AC;

    @Override
    public String toString() {
        switch (this) {
            case INTERVIEW:
                return "INTERVIEW";
            case AC:
                return "AC";
            default:
                return "NORMAL";
        }
    }
}
