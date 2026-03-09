module People
  module PayloadStrategies
    class CrmPayloadStrategy < BaseStrategy
      def person_attributes
        {
          first_name: data[:first_name],
          last_name: data[:last_name],
          email: data[:email],
          phone: data[:phone],
          company: data[:company],
          updated_at: data[:updated_at]
        }
      end
    end
  end
end
