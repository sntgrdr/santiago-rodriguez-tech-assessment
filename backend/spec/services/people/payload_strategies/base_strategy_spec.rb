RSpec.describe People::PayloadStrategies::BaseStrategy do
  subject(:strategy) { described_class.new({}) }

  describe '#person_attributes' do
    it 'raises NotImplementedError' do
      expect { strategy.person_attributes }
        .to raise_error(NotImplementedError)
    end
  end
end
