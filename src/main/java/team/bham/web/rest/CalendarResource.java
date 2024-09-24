package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Calendar;
import team.bham.repository.CalendarRepository;
import team.bham.repository.EventRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Calendar}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CalendarResource {

    private final Logger log = LoggerFactory.getLogger(CalendarResource.class);

    private static final String ENTITY_NAME = "calendar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CalendarRepository calendarRepository;
    private final EventRepository eventRepository;

    public CalendarResource(CalendarRepository calendarRepository, EventRepository eventRepository) {
        this.calendarRepository = calendarRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * {@code POST  /calendars} : Create a new calendar.
     *
     * @param calendar the calendar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new calendar, or with status {@code 400 (Bad Request)} if the calendar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/calendars")
    public ResponseEntity<Calendar> createCalendar(@Valid @RequestBody Calendar calendar) throws URISyntaxException {
        log.debug("REST request to save Calendar : {}", calendar);
        if (calendar.getId() != null) {
            throw new BadRequestAlertException("A new calendar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Calendar result = calendarRepository.save(calendar);
        return ResponseEntity
            .created(new URI("/api/calendars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /calendars/:id} : Updates an existing calendar.
     *
     * @param id the id of the calendar to save.
     * @param calendar the calendar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calendar,
     * or with status {@code 400 (Bad Request)} if the calendar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the calendar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/calendars/{id}")
    public ResponseEntity<Calendar> updateCalendar(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Calendar calendar
    ) throws URISyntaxException {
        log.debug("REST request to update Calendar : {}, {}", id, calendar);
        if (calendar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calendar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calendarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Calendar result = calendarRepository.save(calendar);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, calendar.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /calendars/:id} : Partial updates given fields of an existing calendar, field will ignore if it is null
     *
     * @param id the id of the calendar to save.
     * @param calendar the calendar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calendar,
     * or with status {@code 400 (Bad Request)} if the calendar is not valid,
     * or with status {@code 404 (Not Found)} if the calendar is not found,
     * or with status {@code 500 (Internal Server Error)} if the calendar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/calendars/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Calendar> partialUpdateCalendar(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Calendar calendar
    ) throws URISyntaxException {
        log.debug("REST request to partial update Calendar partially : {}, {}", id, calendar);
        if (calendar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calendar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calendarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Calendar> result = calendarRepository
            .findById(calendar.getId())
            .map(existingCalendar -> {
                if (calendar.getCalendarName() != null) {
                    existingCalendar.setCalendarName(calendar.getCalendarName());
                }
                if (calendar.getCalendarDescription() != null) {
                    existingCalendar.setCalendarDescription(calendar.getCalendarDescription());
                }
                if (calendar.getCalendarColor() != null) {
                    existingCalendar.setCalendarColor(calendar.getCalendarColor());
                }

                return existingCalendar;
            })
            .map(calendarRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, calendar.getId().toString())
        );
    }

    /**
     * {@code GET  /calendars} : get all the calendars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of calendars in body.
     */
    @GetMapping("/calendars")
    public List<Calendar> getAllCalendars() {
        log.debug("REST request to get all Calendars");
        return calendarRepository.findAll();
    }

    /**
     * {@code GET  /calendars/:id} : get the "id" calendar.
     *
     * @param id the id of the calendar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the calendar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/calendars/{id}")
    public ResponseEntity<Calendar> getCalendar(@PathVariable Long id) {
        log.debug("REST request to get Calendar : {}", id);
        Optional<Calendar> calendar = calendarRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(calendar);
    }

    /**
     * {@code DELETE  /calendars/:id} : delete the "id" calendar.
     *
     * @param id the id of the calendar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/calendars/{id}")
    public ResponseEntity<Void> deleteCalendar(@PathVariable Long id) {
        log.debug("REST request to delete Calendar : {}", id);
        Optional<Calendar> calendarOptional = calendarRepository.findById(id);
        if (calendarOptional.isPresent()) {
            Calendar calendar = calendarOptional.get();
            calendar
                .getEvents()
                .forEach(event -> {
                    eventRepository.delete(event);
                });
            calendarRepository.deleteById(id);
            return ResponseEntity
                .noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                .build();
        } else {
            return ResponseEntity.notFound().build();
        }
        //        calendarRepository.deleteById(id);
        //        return ResponseEntity
        //            .noContent()
        //            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
        //            .build();
    }
}
