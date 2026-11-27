package se.felanmalan.property;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(nullable = false, length = 20)
    private String number;

    private Integer floor;

    @Column(name = "tenant_id")
    private Long tenantId;

    protected Apartment() {
    }

    public Apartment(Long propertyId, String number, Integer floor) {
        this.propertyId = propertyId;
        this.number = number;
        this.floor = floor;
    }

    public Long getId() {
        return id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public String getNumber() {
        return number;
    }

    public Integer getFloor() {
        return floor;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
}
