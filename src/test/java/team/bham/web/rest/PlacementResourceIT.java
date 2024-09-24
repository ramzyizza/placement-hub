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
import team.bham.domain.Placement;
import team.bham.repository.PlacementRepository;

/**
 * Integration tests for the {@link PlacementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlacementResourceIT {

    private static final String DEFAULT_ROLE = "AAAAAAAAAA";
    private static final String UPDATED_ROLE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Integer DEFAULT_SALARY = 1;
    private static final Integer UPDATED_SALARY = 2;

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final String DEFAULT_INDUSTRY = "AAAAAAAAAA";
    private static final String UPDATED_INDUSTRY = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT = "BBBBBBBBBB";

    private static final String DEFAULT_JOB_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_JOB_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_MINIMUM_QUALIFICATION = "AAAAAAAAAA";
    private static final String UPDATED_MINIMUM_QUALIFICATION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_APPLICATION_DEADLINE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_APPLICATION_DEADLINE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/placements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlacementMockMvc;

    private Placement placement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Placement createEntity(EntityManager em) {
        Placement placement = new Placement()
            .role(DEFAULT_ROLE)
            .location(DEFAULT_LOCATION)
            .salary(DEFAULT_SALARY)
            .duration(DEFAULT_DURATION)
            .industry(DEFAULT_INDUSTRY)
            .about(DEFAULT_ABOUT)
            .jobDescription(DEFAULT_JOB_DESCRIPTION)
            .minimumQualification(DEFAULT_MINIMUM_QUALIFICATION)
            .applicationDeadline(DEFAULT_APPLICATION_DEADLINE);
        return placement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Placement createUpdatedEntity(EntityManager em) {
        Placement placement = new Placement()
            .role(UPDATED_ROLE)
            .location(UPDATED_LOCATION)
            .salary(UPDATED_SALARY)
            .duration(UPDATED_DURATION)
            .industry(UPDATED_INDUSTRY)
            .about(UPDATED_ABOUT)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .minimumQualification(UPDATED_MINIMUM_QUALIFICATION)
            .applicationDeadline(UPDATED_APPLICATION_DEADLINE);
        return placement;
    }

    @BeforeEach
    public void initTest() {
        placement = createEntity(em);
    }

    @Test
    @Transactional
    void createPlacement() throws Exception {
        int databaseSizeBeforeCreate = placementRepository.findAll().size();
        // Create the Placement
        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isCreated());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeCreate + 1);
        Placement testPlacement = placementList.get(placementList.size() - 1);
        assertThat(testPlacement.getRole()).isEqualTo(DEFAULT_ROLE);
        assertThat(testPlacement.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testPlacement.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testPlacement.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testPlacement.getIndustry()).isEqualTo(DEFAULT_INDUSTRY);
        assertThat(testPlacement.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testPlacement.getJobDescription()).isEqualTo(DEFAULT_JOB_DESCRIPTION);
        assertThat(testPlacement.getMinimumQualification()).isEqualTo(DEFAULT_MINIMUM_QUALIFICATION);
        assertThat(testPlacement.getApplicationDeadline()).isEqualTo(DEFAULT_APPLICATION_DEADLINE);
    }

    @Test
    @Transactional
    void createPlacementWithExistingId() throws Exception {
        // Create the Placement with an existing ID
        placement.setId(1L);

        int databaseSizeBeforeCreate = placementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRoleIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setRole(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setLocation(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalaryIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setSalary(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDurationIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setDuration(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIndustryIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setIndustry(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApplicationDeadlineIsRequired() throws Exception {
        int databaseSizeBeforeTest = placementRepository.findAll().size();
        // set the field null
        placement.setApplicationDeadline(null);

        // Create the Placement, which fails.

        restPlacementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isBadRequest());

        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPlacements() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        // Get all the placementList
        restPlacementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(placement.getId().intValue())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].industry").value(hasItem(DEFAULT_INDUSTRY)))
            .andExpect(jsonPath("$.[*].about").value(hasItem(DEFAULT_ABOUT.toString())))
            .andExpect(jsonPath("$.[*].jobDescription").value(hasItem(DEFAULT_JOB_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].minimumQualification").value(hasItem(DEFAULT_MINIMUM_QUALIFICATION.toString())))
            .andExpect(jsonPath("$.[*].applicationDeadline").value(hasItem(sameInstant(DEFAULT_APPLICATION_DEADLINE))));
    }

    @Test
    @Transactional
    void getPlacement() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        // Get the placement
        restPlacementMockMvc
            .perform(get(ENTITY_API_URL_ID, placement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(placement.getId().intValue()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.industry").value(DEFAULT_INDUSTRY))
            .andExpect(jsonPath("$.about").value(DEFAULT_ABOUT.toString()))
            .andExpect(jsonPath("$.jobDescription").value(DEFAULT_JOB_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.minimumQualification").value(DEFAULT_MINIMUM_QUALIFICATION.toString()))
            .andExpect(jsonPath("$.applicationDeadline").value(sameInstant(DEFAULT_APPLICATION_DEADLINE)));
    }

    @Test
    @Transactional
    void getNonExistingPlacement() throws Exception {
        // Get the placement
        restPlacementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlacement() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        int databaseSizeBeforeUpdate = placementRepository.findAll().size();

        // Update the placement
        Placement updatedPlacement = placementRepository.findById(placement.getId()).get();
        // Disconnect from session so that the updates on updatedPlacement are not directly saved in db
        em.detach(updatedPlacement);
        updatedPlacement
            .role(UPDATED_ROLE)
            .location(UPDATED_LOCATION)
            .salary(UPDATED_SALARY)
            .duration(UPDATED_DURATION)
            .industry(UPDATED_INDUSTRY)
            .about(UPDATED_ABOUT)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .minimumQualification(UPDATED_MINIMUM_QUALIFICATION)
            .applicationDeadline(UPDATED_APPLICATION_DEADLINE);

        restPlacementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlacement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlacement))
            )
            .andExpect(status().isOk());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
        Placement testPlacement = placementList.get(placementList.size() - 1);
        assertThat(testPlacement.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testPlacement.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testPlacement.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testPlacement.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testPlacement.getIndustry()).isEqualTo(UPDATED_INDUSTRY);
        assertThat(testPlacement.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testPlacement.getJobDescription()).isEqualTo(UPDATED_JOB_DESCRIPTION);
        assertThat(testPlacement.getMinimumQualification()).isEqualTo(UPDATED_MINIMUM_QUALIFICATION);
        assertThat(testPlacement.getApplicationDeadline()).isEqualTo(UPDATED_APPLICATION_DEADLINE);
    }

    @Test
    @Transactional
    void putNonExistingPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, placement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(placement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(placement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(placement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlacementWithPatch() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        int databaseSizeBeforeUpdate = placementRepository.findAll().size();

        // Update the placement using partial update
        Placement partialUpdatedPlacement = new Placement();
        partialUpdatedPlacement.setId(placement.getId());

        partialUpdatedPlacement.role(UPDATED_ROLE).duration(UPDATED_DURATION).about(UPDATED_ABOUT).jobDescription(UPDATED_JOB_DESCRIPTION);

        restPlacementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlacement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlacement))
            )
            .andExpect(status().isOk());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
        Placement testPlacement = placementList.get(placementList.size() - 1);
        assertThat(testPlacement.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testPlacement.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testPlacement.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testPlacement.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testPlacement.getIndustry()).isEqualTo(DEFAULT_INDUSTRY);
        assertThat(testPlacement.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testPlacement.getJobDescription()).isEqualTo(UPDATED_JOB_DESCRIPTION);
        assertThat(testPlacement.getMinimumQualification()).isEqualTo(DEFAULT_MINIMUM_QUALIFICATION);
        assertThat(testPlacement.getApplicationDeadline()).isEqualTo(DEFAULT_APPLICATION_DEADLINE);
    }

    @Test
    @Transactional
    void fullUpdatePlacementWithPatch() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        int databaseSizeBeforeUpdate = placementRepository.findAll().size();

        // Update the placement using partial update
        Placement partialUpdatedPlacement = new Placement();
        partialUpdatedPlacement.setId(placement.getId());

        partialUpdatedPlacement
            .role(UPDATED_ROLE)
            .location(UPDATED_LOCATION)
            .salary(UPDATED_SALARY)
            .duration(UPDATED_DURATION)
            .industry(UPDATED_INDUSTRY)
            .about(UPDATED_ABOUT)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .minimumQualification(UPDATED_MINIMUM_QUALIFICATION)
            .applicationDeadline(UPDATED_APPLICATION_DEADLINE);

        restPlacementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlacement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlacement))
            )
            .andExpect(status().isOk());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
        Placement testPlacement = placementList.get(placementList.size() - 1);
        assertThat(testPlacement.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testPlacement.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testPlacement.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testPlacement.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testPlacement.getIndustry()).isEqualTo(UPDATED_INDUSTRY);
        assertThat(testPlacement.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testPlacement.getJobDescription()).isEqualTo(UPDATED_JOB_DESCRIPTION);
        assertThat(testPlacement.getMinimumQualification()).isEqualTo(UPDATED_MINIMUM_QUALIFICATION);
        assertThat(testPlacement.getApplicationDeadline()).isEqualTo(UPDATED_APPLICATION_DEADLINE);
    }

    @Test
    @Transactional
    void patchNonExistingPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, placement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(placement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(placement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlacement() throws Exception {
        int databaseSizeBeforeUpdate = placementRepository.findAll().size();
        placement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlacementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(placement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Placement in the database
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlacement() throws Exception {
        // Initialize the database
        placementRepository.saveAndFlush(placement);

        int databaseSizeBeforeDelete = placementRepository.findAll().size();

        // Delete the placement
        restPlacementMockMvc
            .perform(delete(ENTITY_API_URL_ID, placement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Placement> placementList = placementRepository.findAll();
        assertThat(placementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
