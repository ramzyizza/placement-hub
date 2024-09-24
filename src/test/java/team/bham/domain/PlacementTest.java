package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PlacementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Placement.class);
        Placement placement1 = new Placement();
        placement1.setId(1L);
        Placement placement2 = new Placement();
        placement2.setId(placement1.getId());
        assertThat(placement1).isEqualTo(placement2);
        placement2.setId(2L);
        assertThat(placement1).isNotEqualTo(placement2);
        placement1.setId(null);
        assertThat(placement1).isNotEqualTo(placement2);
    }
}
