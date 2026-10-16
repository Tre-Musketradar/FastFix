-- Första versionen av databasschemat, enligt projektförslaget.
-- Enum-värdena ska stämma exakt med frontendens typer (docs/mvp/frontend-plan.md).

CREATE TYPE user_role AS ENUM ('TENANT', 'TECHNICIAN', 'MANAGER');
CREATE TYPE ticket_status AS ENUM ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED');
CREATE TYPE ticket_category AS ENUM ('PLUMBING', 'ELECTRICAL', 'APPLIANCES', 'VENTILATION', 'LOCKS_DOORS', 'OTHER');
CREATE TYPE ticket_priority AS ENUM ('URGENT', 'HIGH', 'NORMAL', 'LOW');

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          user_role    NOT NULL
);

CREATE TABLE properties (
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    address  VARCHAR(255) NOT NULL,
    owner_id BIGINT       NOT NULL REFERENCES users (id)
);

CREATE TABLE apartments (
    id          BIGSERIAL PRIMARY KEY,
    property_id BIGINT      NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    number      VARCHAR(20) NOT NULL,
    floor       INTEGER,
    tenant_id   BIGINT      UNIQUE REFERENCES users (id) ON DELETE SET NULL,
    UNIQUE (property_id, number)
);

CREATE TABLE tickets (
    id                 BIGSERIAL PRIMARY KEY,
    apartment_id       BIGINT          NOT NULL REFERENCES apartments (id),
    created_by         BIGINT          NOT NULL REFERENCES users (id),
    assigned_to        BIGINT          REFERENCES users (id),
    category           ticket_category NOT NULL,
    priority           ticket_priority NOT NULL DEFAULT 'NORMAL',
    status             ticket_status   NOT NULL DEFAULT 'NEW',
    description        TEXT            NOT NULL,
    master_key_allowed BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ     NOT NULL DEFAULT now(),
    closed_at          TIMESTAMPTZ
);

CREATE INDEX idx_tickets_apartment ON tickets (apartment_id);
CREATE INDEX idx_tickets_created_by ON tickets (created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets (assigned_to);
CREATE INDEX idx_tickets_status ON tickets (status);

CREATE TABLE comments (
    id         BIGSERIAL PRIMARY KEY,
    ticket_id  BIGINT      NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    author_id  BIGINT      NOT NULL REFERENCES users (id),
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_ticket ON comments (ticket_id);

CREATE TABLE status_history (
    id         BIGSERIAL PRIMARY KEY,
    ticket_id  BIGINT        NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    old_status ticket_status,
    new_status ticket_status NOT NULL,
    changed_by BIGINT        NOT NULL REFERENCES users (id),
    changed_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_history_ticket ON status_history (ticket_id);

CREATE TABLE attachments (
    id          BIGSERIAL PRIMARY KEY,
    ticket_id   BIGINT        NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    file_url    VARCHAR(1000) NOT NULL,
    uploaded_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_ticket ON attachments (ticket_id);
