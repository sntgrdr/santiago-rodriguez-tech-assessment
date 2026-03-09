module People
  module PayloadStrategies
    class BaseStrategy
      def initialize(data)
        @data = data
      end

      def person_attributes
        raise NotImplementedError
      end

      private

      attr_reader :data
    end
  end
end
