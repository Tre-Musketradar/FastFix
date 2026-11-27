package se.felanmalan.property;

/** En lägenhet med fastighetens namn och adress, för listor och hyresgästens vy. */
public record ApartmentSummary(
        Long id,
        String propertyName,
        String propertyAddress,
        String number,
        Integer floor) {
}
