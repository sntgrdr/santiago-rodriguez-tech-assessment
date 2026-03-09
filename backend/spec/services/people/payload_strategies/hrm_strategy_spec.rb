RSpec.describe People::PayloadStrategies::HrmPayloadStrategy do
  subject(:strategy) { described_class.new(payload) }

  let(:payload) do
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job_title: 'Engineer',
      department: 'Engineering',
      manager_email: 'manager@example.com',
      start_date: Date.today,
      updated_at: Time.current
    }
  end

  describe '#person_attributes' do
    it 'maps HRM attributes correctly' do
      expect(strategy.person_attributes).to include(
        job_title: payload[:job_title],
        department: payload[:department],
        manager_email: payload[:manager_email],
        start_date: payload[:start_date]
      )
    end
  end
end
