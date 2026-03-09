module People
  class ExternalIdentitySyncService
    attr_reader :person, :source, :external_id

    def initialize(person, source, external_id)
      @person = person
      @source = source
      @external_id = external_id
    end

    def call
      person.external_identities.find_or_initialize_by(
        source: source,
        external_id: external_id
      ).tap do |identity|
        identity.last_synced_at = Time.current
        identity.save!
      end
    end
  end
end
