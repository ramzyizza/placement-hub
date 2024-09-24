package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.CompanyPosts;
import team.bham.repository.CompanyPostsRepository;

/**
 * Integration tests for the {@link CompanyPostsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompanyPostsResourceIT {

    private static final String DEFAULT_POST_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_POST_CONTENT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_POST_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_POST_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_POST_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_POST_IMAGE_CONTENT_TYPE = "image/png";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/company-posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompanyPostsRepository companyPostsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompanyPostsMockMvc;

    private CompanyPosts companyPosts;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyPosts createEntity(EntityManager em) {
        CompanyPosts companyPosts = new CompanyPosts()
            .postContent(DEFAULT_POST_CONTENT)
            .postImage(DEFAULT_POST_IMAGE)
            .postImageContentType(DEFAULT_POST_IMAGE_CONTENT_TYPE)
            .createdAt(DEFAULT_CREATED_AT);
        return companyPosts;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyPosts createUpdatedEntity(EntityManager em) {
        CompanyPosts companyPosts = new CompanyPosts()
            .postContent(UPDATED_POST_CONTENT)
            .postImage(UPDATED_POST_IMAGE)
            .postImageContentType(UPDATED_POST_IMAGE_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);
        return companyPosts;
    }

    @BeforeEach
    public void initTest() {
        companyPosts = createEntity(em);
    }

    @Test
    @Transactional
    void createCompanyPosts() throws Exception {
        int databaseSizeBeforeCreate = companyPostsRepository.findAll().size();
        // Create the CompanyPosts
        restCompanyPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyPosts)))
            .andExpect(status().isCreated());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyPosts testCompanyPosts = companyPostsList.get(companyPostsList.size() - 1);
        assertThat(testCompanyPosts.getPostContent()).isEqualTo(DEFAULT_POST_CONTENT);
        assertThat(testCompanyPosts.getPostImage()).isEqualTo(DEFAULT_POST_IMAGE);
        assertThat(testCompanyPosts.getPostImageContentType()).isEqualTo(DEFAULT_POST_IMAGE_CONTENT_TYPE);
        assertThat(testCompanyPosts.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void createCompanyPostsWithExistingId() throws Exception {
        // Create the CompanyPosts with an existing ID
        companyPosts.setId(1L);

        int databaseSizeBeforeCreate = companyPostsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyPosts)))
            .andExpect(status().isBadRequest());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPostContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyPostsRepository.findAll().size();
        // set the field null
        companyPosts.setPostContent(null);

        // Create the CompanyPosts, which fails.

        restCompanyPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyPosts)))
            .andExpect(status().isBadRequest());

        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyPostsRepository.findAll().size();
        // set the field null
        companyPosts.setCreatedAt(null);

        // Create the CompanyPosts, which fails.

        restCompanyPostsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyPosts)))
            .andExpect(status().isBadRequest());

        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCompanyPosts() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        // Get all the companyPostsList
        restCompanyPostsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyPosts.getId().intValue())))
            .andExpect(jsonPath("$.[*].postContent").value(hasItem(DEFAULT_POST_CONTENT)))
            .andExpect(jsonPath("$.[*].postImageContentType").value(hasItem(DEFAULT_POST_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].postImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_POST_IMAGE))))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getCompanyPosts() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        // Get the companyPosts
        restCompanyPostsMockMvc
            .perform(get(ENTITY_API_URL_ID, companyPosts.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(companyPosts.getId().intValue()))
            .andExpect(jsonPath("$.postContent").value(DEFAULT_POST_CONTENT))
            .andExpect(jsonPath("$.postImageContentType").value(DEFAULT_POST_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.postImage").value(Base64Utils.encodeToString(DEFAULT_POST_IMAGE)))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingCompanyPosts() throws Exception {
        // Get the companyPosts
        restCompanyPostsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompanyPosts() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();

        // Update the companyPosts
        CompanyPosts updatedCompanyPosts = companyPostsRepository.findById(companyPosts.getId()).get();
        // Disconnect from session so that the updates on updatedCompanyPosts are not directly saved in db
        em.detach(updatedCompanyPosts);
        updatedCompanyPosts
            .postContent(UPDATED_POST_CONTENT)
            .postImage(UPDATED_POST_IMAGE)
            .postImageContentType(UPDATED_POST_IMAGE_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);

        restCompanyPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompanyPosts.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompanyPosts))
            )
            .andExpect(status().isOk());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
        CompanyPosts testCompanyPosts = companyPostsList.get(companyPostsList.size() - 1);
        assertThat(testCompanyPosts.getPostContent()).isEqualTo(UPDATED_POST_CONTENT);
        assertThat(testCompanyPosts.getPostImage()).isEqualTo(UPDATED_POST_IMAGE);
        assertThat(testCompanyPosts.getPostImageContentType()).isEqualTo(UPDATED_POST_IMAGE_CONTENT_TYPE);
        assertThat(testCompanyPosts.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, companyPosts.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyPosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyPosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyPosts)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompanyPostsWithPatch() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();

        // Update the companyPosts using partial update
        CompanyPosts partialUpdatedCompanyPosts = new CompanyPosts();
        partialUpdatedCompanyPosts.setId(companyPosts.getId());

        partialUpdatedCompanyPosts
            .postContent(UPDATED_POST_CONTENT)
            .postImage(UPDATED_POST_IMAGE)
            .postImageContentType(UPDATED_POST_IMAGE_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);

        restCompanyPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyPosts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyPosts))
            )
            .andExpect(status().isOk());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
        CompanyPosts testCompanyPosts = companyPostsList.get(companyPostsList.size() - 1);
        assertThat(testCompanyPosts.getPostContent()).isEqualTo(UPDATED_POST_CONTENT);
        assertThat(testCompanyPosts.getPostImage()).isEqualTo(UPDATED_POST_IMAGE);
        assertThat(testCompanyPosts.getPostImageContentType()).isEqualTo(UPDATED_POST_IMAGE_CONTENT_TYPE);
        assertThat(testCompanyPosts.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateCompanyPostsWithPatch() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();

        // Update the companyPosts using partial update
        CompanyPosts partialUpdatedCompanyPosts = new CompanyPosts();
        partialUpdatedCompanyPosts.setId(companyPosts.getId());

        partialUpdatedCompanyPosts
            .postContent(UPDATED_POST_CONTENT)
            .postImage(UPDATED_POST_IMAGE)
            .postImageContentType(UPDATED_POST_IMAGE_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);

        restCompanyPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyPosts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyPosts))
            )
            .andExpect(status().isOk());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
        CompanyPosts testCompanyPosts = companyPostsList.get(companyPostsList.size() - 1);
        assertThat(testCompanyPosts.getPostContent()).isEqualTo(UPDATED_POST_CONTENT);
        assertThat(testCompanyPosts.getPostImage()).isEqualTo(UPDATED_POST_IMAGE);
        assertThat(testCompanyPosts.getPostImageContentType()).isEqualTo(UPDATED_POST_IMAGE_CONTENT_TYPE);
        assertThat(testCompanyPosts.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, companyPosts.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyPosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyPosts))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompanyPosts() throws Exception {
        int databaseSizeBeforeUpdate = companyPostsRepository.findAll().size();
        companyPosts.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyPostsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(companyPosts))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyPosts in the database
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompanyPosts() throws Exception {
        // Initialize the database
        companyPostsRepository.saveAndFlush(companyPosts);

        int databaseSizeBeforeDelete = companyPostsRepository.findAll().size();

        // Delete the companyPosts
        restCompanyPostsMockMvc
            .perform(delete(ENTITY_API_URL_ID, companyPosts.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompanyPosts> companyPostsList = companyPostsRepository.findAll();
        assertThat(companyPostsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
