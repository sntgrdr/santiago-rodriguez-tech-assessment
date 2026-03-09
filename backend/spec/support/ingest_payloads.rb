module IngestPayloads
  PAYLOADS = {
      crm: {
        external_id: 'crm_123',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '123456789',
        company: 'Acme Inc',
        updated_at: Time.current
      },

      hrm: {
        external_id: 'hrm_456',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        job_title: 'Engineer',
        department: 'Engineering',
        manager_email: 'manager@example.com',
        start_date: Date.today,
        updated_at: Time.current
      }
    }.freeze
end
