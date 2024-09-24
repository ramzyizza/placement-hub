package team.bham.domain.enumeration;

/**
 * The RepeatType enumeration.
 */
public enum RepeatType {
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY,
    NA;

    @Override
    public String toString() {
        switch (this) {
            case DAILY:
                return "Daily";
            case WEEKLY:
                return "Weekly";
            case MONTHLY:
                return "Monthly";
            case YEARLY:
                return "Yearly";
            default:
                return "No repeat";
        }
    }
}
