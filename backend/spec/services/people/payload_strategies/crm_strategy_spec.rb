require "rails_helper"

RSpec.describe People::PayloadStrategies::CrmPayloadStrategy do
  subject(:strategy) { described_class.new(payload) }

  let(:payload) do
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '123456',
      company: 'Acme',
      updated_at: Time.current
    }
  end

  describe '#person_attributes' do
    it 'maps CRM attributes correctly' do
      expect(strategy.person_attributes).to include(
        first_name: payload[:first_name],
        last_name: payload[:last_name],
        email: payload[:email],
        phone: payload[:phone],
        company: payload[:company]
      )
    end
  end
end
