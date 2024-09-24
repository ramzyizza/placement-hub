package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.UserCompany;
import team.bham.domain.enumeration.CompanySize;
import team.bham.domain.enumeration.Industry;
import team.bham.repository.UserCompanyRepository;

/**
 * Integration tests for the {@link UserCompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserCompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_PROFILE_IMAGE_BACKGROUND = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_IMAGE_BACKGROUND = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE = "image/png";

    private static final CompanySize DEFAULT_COMPANY_SIZE = CompanySize.LESS_THAN_500;
    private static final CompanySize UPDATED_COMPANY_SIZE = CompanySize.BETWEEN_500_AND_1000;

    private static final Industry DEFAULT_INDUSTRY = Industry.Agriculture;
    private static final Industry UPDATED_INDUSTRY = Industry.Aerospace;

    private static final Integer DEFAULT_TOTAL_LOCATION = 1;
    private static final Integer UPDATED_TOTAL_LOCATION = 2;

    private static final String ENTITY_API_URL = "/api/user-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserCompanyRepository userCompanyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserCompanyMockMvc;

    private UserCompany userCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserCompany createEntity(EntityManager em) {
        UserCompany userCompany = new UserCompany()
            .name(DEFAULT_NAME)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .profileImageBackground(DEFAULT_PROFILE_IMAGE_BACKGROUND)
            .profileImageBackgroundContentType(DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE)
            .companySize(DEFAULT_COMPANY_SIZE)
            .industry(DEFAULT_INDUSTRY)
            .totalLocation(DEFAULT_TOTAL_LOCATION);
        return userCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserCompany createUpdatedEntity(EntityManager em) {
        UserCompany userCompany = new UserCompany()
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .profileImageBackground(UPDATED_PROFILE_IMAGE_BACKGROUND)
            .profileImageBackgroundContentType(UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE)
            .companySize(UPDATED_COMPANY_SIZE)
            .industry(UPDATED_INDUSTRY)
            .totalLocation(UPDATED_TOTAL_LOCATION);
        return userCompany;
    }

    @BeforeEach
    public void initTest() {
        userCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createUserCompany() throws Exception {
        int databaseSizeBeforeCreate = userCompanyRepository.findAll().size();
        // Create the UserCompany
        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isCreated());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        UserCompany testUserCompany = userCompanyList.get(userCompanyList.size() - 1);
        assertThat(testUserCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUserCompany.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testUserCompany.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testUserCompany.getProfileImageBackground()).isEqualTo(DEFAULT_PROFILE_IMAGE_BACKGROUND);
        assertThat(testUserCompany.getProfileImageBackgroundContentType()).isEqualTo(DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE);
        assertThat(testUserCompany.getCompanySize()).isEqualTo(DEFAULT_COMPANY_SIZE);
        assertThat(testUserCompany.getIndustry()).isEqualTo(DEFAULT_INDUSTRY);
        assertThat(testUserCompany.getTotalLocation()).isEqualTo(DEFAULT_TOTAL_LOCATION);
    }

    @Test
    @Transactional
    void createUserCompanyWithExistingId() throws Exception {
        // Create the UserCompany with an existing ID
        userCompany.setId(1L);

        int databaseSizeBeforeCreate = userCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isBadRequest());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userCompanyRepository.findAll().size();
        // set the field null
        userCompany.setName(null);

        // Create the UserCompany, which fails.

        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isBadRequest());

        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCompanySizeIsRequired() throws Exception {
        int databaseSizeBeforeTest = userCompanyRepository.findAll().size();
        // set the field null
        userCompany.setCompanySize(null);

        // Create the UserCompany, which fails.

        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isBadRequest());

        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIndustryIsRequired() throws Exception {
        int databaseSizeBeforeTest = userCompanyRepository.findAll().size();
        // set the field null
        userCompany.setIndustry(null);

        // Create the UserCompany, which fails.

        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isBadRequest());

        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTotalLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = userCompanyRepository.findAll().size();
        // set the field null
        userCompany.setTotalLocation(null);

        // Create the UserCompany, which fails.

        restUserCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isBadRequest());

        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserCompanies() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        // Get all the userCompanyList
        restUserCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].profileImageBackgroundContentType").value(hasItem(DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE)))
            .andExpect(
                jsonPath("$.[*].profileImageBackground").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_IMAGE_BACKGROUND)))
            )
            .andExpect(jsonPath("$.[*].companySize").value(hasItem(DEFAULT_COMPANY_SIZE.toString())))
            .andExpect(jsonPath("$.[*].industry").value(hasItem(DEFAULT_INDUSTRY.toString())))
            .andExpect(jsonPath("$.[*].totalLocation").value(hasItem(DEFAULT_TOTAL_LOCATION)));
    }

    @Test
    @Transactional
    void getUserCompany() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        // Get the userCompany
        restUserCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, userCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userCompany.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.profileImageBackgroundContentType").value(DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE))
            .andExpect(jsonPath("$.profileImageBackground").value(Base64Utils.encodeToString(DEFAULT_PROFILE_IMAGE_BACKGROUND)))
            .andExpect(jsonPath("$.companySize").value(DEFAULT_COMPANY_SIZE.toString()))
            .andExpect(jsonPath("$.industry").value(DEFAULT_INDUSTRY.toString()))
            .andExpect(jsonPath("$.totalLocation").value(DEFAULT_TOTAL_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingUserCompany() throws Exception {
        // Get the userCompany
        restUserCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserCompany() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();

        // Update the userCompany
        UserCompany updatedUserCompany = userCompanyRepository.findById(userCompany.getId()).get();
        // Disconnect from session so that the updates on updatedUserCompany are not directly saved in db
        em.detach(updatedUserCompany);
        updatedUserCompany
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .profileImageBackground(UPDATED_PROFILE_IMAGE_BACKGROUND)
            .profileImageBackgroundContentType(UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE)
            .companySize(UPDATED_COMPANY_SIZE)
            .industry(UPDATED_INDUSTRY)
            .totalLocation(UPDATED_TOTAL_LOCATION);

        restUserCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserCompany))
            )
            .andExpect(status().isOk());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
        UserCompany testUserCompany = userCompanyList.get(userCompanyList.size() - 1);
        assertThat(testUserCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUserCompany.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testUserCompany.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testUserCompany.getProfileImageBackground()).isEqualTo(UPDATED_PROFILE_IMAGE_BACKGROUND);
        assertThat(testUserCompany.getProfileImageBackgroundContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE);
        assertThat(testUserCompany.getCompanySize()).isEqualTo(UPDATED_COMPANY_SIZE);
        assertThat(testUserCompany.getIndustry()).isEqualTo(UPDATED_INDUSTRY);
        assertThat(testUserCompany.getTotalLocation()).isEqualTo(UPDATED_TOTAL_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userCompany)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserCompanyWithPatch() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();

        // Update the userCompany using partial update
        UserCompany partialUpdatedUserCompany = new UserCompany();
        partialUpdatedUserCompany.setId(userCompany.getId());

        partialUpdatedUserCompany.companySize(UPDATED_COMPANY_SIZE);

        restUserCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserCompany))
            )
            .andExpect(status().isOk());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
        UserCompany testUserCompany = userCompanyList.get(userCompanyList.size() - 1);
        assertThat(testUserCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUserCompany.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testUserCompany.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testUserCompany.getProfileImageBackground()).isEqualTo(DEFAULT_PROFILE_IMAGE_BACKGROUND);
        assertThat(testUserCompany.getProfileImageBackgroundContentType()).isEqualTo(DEFAULT_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE);
        assertThat(testUserCompany.getCompanySize()).isEqualTo(UPDATED_COMPANY_SIZE);
        assertThat(testUserCompany.getIndustry()).isEqualTo(DEFAULT_INDUSTRY);
        assertThat(testUserCompany.getTotalLocation()).isEqualTo(DEFAULT_TOTAL_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateUserCompanyWithPatch() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();

        // Update the userCompany using partial update
        UserCompany partialUpdatedUserCompany = new UserCompany();
        partialUpdatedUserCompany.setId(userCompany.getId());

        partialUpdatedUserCompany
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .profileImageBackground(UPDATED_PROFILE_IMAGE_BACKGROUND)
            .profileImageBackgroundContentType(UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE)
            .companySize(UPDATED_COMPANY_SIZE)
            .industry(UPDATED_INDUSTRY)
            .totalLocation(UPDATED_TOTAL_LOCATION);

        restUserCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserCompany))
            )
            .andExpect(status().isOk());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
        UserCompany testUserCompany = userCompanyList.get(userCompanyList.size() - 1);
        assertThat(testUserCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUserCompany.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testUserCompany.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testUserCompany.getProfileImageBackground()).isEqualTo(UPDATED_PROFILE_IMAGE_BACKGROUND);
        assertThat(testUserCompany.getProfileImageBackgroundContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_BACKGROUND_CONTENT_TYPE);
        assertThat(testUserCompany.getCompanySize()).isEqualTo(UPDATED_COMPANY_SIZE);
        assertThat(testUserCompany.getIndustry()).isEqualTo(UPDATED_INDUSTRY);
        assertThat(testUserCompany.getTotalLocation()).isEqualTo(UPDATED_TOTAL_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserCompany() throws Exception {
        int databaseSizeBeforeUpdate = userCompanyRepository.findAll().size();
        userCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserCompany in the database
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserCompany() throws Exception {
        // Initialize the database
        userCompanyRepository.saveAndFlush(userCompany);

        int databaseSizeBeforeDelete = userCompanyRepository.findAll().size();

        // Delete the userCompany
        restUserCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, userCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserCompany> userCompanyList = userCompanyRepository.findAll();
        assertThat(userCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
