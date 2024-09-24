package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VideoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Video.class);
        Video video1 = new Video();
        video1.setId(1L);
        Video video2 = new Video();
        video2.setId(video1.getId());
        assertThat(video1).isEqualTo(video2);
        video2.setId(2L);
        assertThat(video1).isNotEqualTo(video2);
        video1.setId(null);
        assertThat(video1).isNotEqualTo(video2);
    }
}
