package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserCompany.class);
        UserCompany userCompany1 = new UserCompany();
        userCompany1.setId(1L);
        UserCompany userCompany2 = new UserCompany();
        userCompany2.setId(userCompany1.getId());
        assertThat(userCompany1).isEqualTo(userCompany2);
        userCompany2.setId(2L);
        assertThat(userCompany1).isNotEqualTo(userCompany2);
        userCompany1.setId(null);
        assertThat(userCompany1).isNotEqualTo(userCompany2);
    }
}
