package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FavouriteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Favourite.class);
        Favourite favourite1 = new Favourite();
        favourite1.setId(1L);
        Favourite favourite2 = new Favourite();
        favourite2.setId(favourite1.getId());
        assertThat(favourite1).isEqualTo(favourite2);
        favourite2.setId(2L);
        assertThat(favourite1).isNotEqualTo(favourite2);
        favourite1.setId(null);
        assertThat(favourite1).isNotEqualTo(favourite2);
    }
}
