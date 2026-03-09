require "rails_helper"

RSpec.describe People::ExternalIdentitySyncService do
  subject(:service) do
    described_class.new(person, source, external_id)
  end

  let(:person) { create(:person) }
  let(:source) { "crm" }
  let(:external_id) { "crm_123" }

  describe "#call" do
    it "creates an external identity" do
      expect { service.call }
        .to change(person.external_identities, :count).by(1)
    end

    it "sets the last_synced_at timestamp" do
      identity = service.call

      expect(identity.last_synced_at).to be_present
    end

    context "when identity already exists" do
      before do
        person.external_identities.create!(
          source: source,
          external_id: external_id
        )
      end

      it "does not create another identity" do
        expect { service.call }
          .not_to change(person.external_identities, :count)
      end
    end
  end
end
