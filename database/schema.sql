-- EduAdmin / Aiven MySQL
-- Ejecutar conectado a la base de datos defaultdb.
-- No se crea ni cambia de base de datos aquí.

CREATE TABLE IF NOT EXISTS students (
  id CHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  section VARCHAR(20),
  representative_name VARCHAR(150),
  representative_phone VARCHAR(50),
  monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_students_name (last_name, first_name),
  INDEX idx_students_grade (grade)
);

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY,
  student_id CHAR(36) NOT NULL,
  payment_month DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  status ENUM('verified','pending','rejected') NOT NULL DEFAULT 'verified',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payments_student (student_id),
  INDEX idx_payments_month (payment_month),
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS institution_settings (
  id CHAR(36) PRIMARY KEY,
  institution_name VARCHAR(200) NOT NULL DEFAULT 'Mi Institución Educativa',
  logo_url TEXT,
  default_monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 80,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO institution_settings (id, institution_name, default_monthly_fee)
SELECT UUID(), 'Mi Institución Educativa', 80
WHERE NOT EXISTS (SELECT 1 FROM institution_settings);
