module People
  module PayloadStrategies
    class HrmPayloadStrategy < BaseStrategy
      def person_attributes
        {
          first_name: data[:first_name],
          last_name: data[:last_name],
          email: data[:email],
          job_title: data[:job_title],
          department: data[:department],
          manager_email: data[:manager_email],
          start_date: data[:start_date],
          updated_at: data[:updated_at]
        }
      end
    end
  end
end
