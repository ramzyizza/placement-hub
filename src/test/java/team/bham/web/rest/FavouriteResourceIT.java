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
import team.bham.IntegrationTest;
import team.bham.domain.Favourite;
import team.bham.repository.FavouriteRepository;

/**
 * Integration tests for the {@link FavouriteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FavouriteResourceIT {

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/favourites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFavouriteMockMvc;

    private Favourite favourite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Favourite createEntity(EntityManager em) {
        Favourite favourite = new Favourite().createdAt(DEFAULT_CREATED_AT);
        return favourite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Favourite createUpdatedEntity(EntityManager em) {
        Favourite favourite = new Favourite().createdAt(UPDATED_CREATED_AT);
        return favourite;
    }

    @BeforeEach
    public void initTest() {
        favourite = createEntity(em);
    }

    @Test
    @Transactional
    void createFavourite() throws Exception {
        int databaseSizeBeforeCreate = favouriteRepository.findAll().size();
        // Create the Favourite
        restFavouriteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favourite)))
            .andExpect(status().isCreated());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeCreate + 1);
        Favourite testFavourite = favouriteList.get(favouriteList.size() - 1);
        assertThat(testFavourite.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void createFavouriteWithExistingId() throws Exception {
        // Create the Favourite with an existing ID
        favourite.setId(1L);

        int databaseSizeBeforeCreate = favouriteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFavouriteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favourite)))
            .andExpect(status().isBadRequest());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = favouriteRepository.findAll().size();
        // set the field null
        favourite.setCreatedAt(null);

        // Create the Favourite, which fails.

        restFavouriteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favourite)))
            .andExpect(status().isBadRequest());

        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFavourites() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        // Get all the favouriteList
        restFavouriteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(favourite.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getFavourite() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        // Get the favourite
        restFavouriteMockMvc
            .perform(get(ENTITY_API_URL_ID, favourite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(favourite.getId().intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingFavourite() throws Exception {
        // Get the favourite
        restFavouriteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFavourite() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();

        // Update the favourite
        Favourite updatedFavourite = favouriteRepository.findById(favourite.getId()).get();
        // Disconnect from session so that the updates on updatedFavourite are not directly saved in db
        em.detach(updatedFavourite);
        updatedFavourite.createdAt(UPDATED_CREATED_AT);

        restFavouriteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFavourite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFavourite))
            )
            .andExpect(status().isOk());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
        Favourite testFavourite = favouriteList.get(favouriteList.size() - 1);
        assertThat(testFavourite.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, favourite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favourite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favourite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favourite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFavouriteWithPatch() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();

        // Update the favourite using partial update
        Favourite partialUpdatedFavourite = new Favourite();
        partialUpdatedFavourite.setId(favourite.getId());

        partialUpdatedFavourite.createdAt(UPDATED_CREATED_AT);

        restFavouriteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavourite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavourite))
            )
            .andExpect(status().isOk());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
        Favourite testFavourite = favouriteList.get(favouriteList.size() - 1);
        assertThat(testFavourite.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateFavouriteWithPatch() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();

        // Update the favourite using partial update
        Favourite partialUpdatedFavourite = new Favourite();
        partialUpdatedFavourite.setId(favourite.getId());

        partialUpdatedFavourite.createdAt(UPDATED_CREATED_AT);

        restFavouriteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavourite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavourite))
            )
            .andExpect(status().isOk());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
        Favourite testFavourite = favouriteList.get(favouriteList.size() - 1);
        assertThat(testFavourite.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, favourite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favourite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favourite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFavourite() throws Exception {
        int databaseSizeBeforeUpdate = favouriteRepository.findAll().size();
        favourite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouriteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(favourite))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Favourite in the database
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFavourite() throws Exception {
        // Initialize the database
        favouriteRepository.saveAndFlush(favourite);

        int databaseSizeBeforeDelete = favouriteRepository.findAll().size();

        // Delete the favourite
        restFavouriteMockMvc
            .perform(delete(ENTITY_API_URL_ID, favourite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Favourite> favouriteList = favouriteRepository.findAll();
        assertThat(favouriteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
