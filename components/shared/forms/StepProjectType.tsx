const PROJECT_TYPES = [
  {
    key: 'full_home',
    icon: (
      <span className='inline-block w-6 h-6 bg-green-100 rounded-full mr-2' />
    ), // Replace with actual icon
    title: 'Full Home Build/Addition',
    desc: 'Start a new home from scratch or add a room, floor, or extension to your existing space.',
  },
  {
    key: 'interior',
    icon: (
      <span className='inline-block w-6 h-6 bg-blue-100 rounded-full mr-2' />
    ), // Replace with actual icon
    title: 'Interior',
    desc: 'Renovate or upgrade interiors like kitchen, bathroom, living room, or complete home redesign.',
  },
  {
    key: 'exterior',
    icon: (
      <span className='inline-block w-6 h-6 bg-orange-100 rounded-full mr-2' />
    ), // Replace with actual icon
    title: 'Exterior',
    desc: 'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
  },
  {
    key: 'multi_trade',
    icon: (
      <span className='inline-block w-6 h-6 bg-yellow-100 rounded-full mr-2' />
    ), // Replace with actual icon
    title: 'Single/Multi Trade',
    desc: 'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
  },
  {
    key: 'repair',
    icon: (
      <span className='inline-block w-6 h-6 bg-cyan-100 rounded-full mr-2' />
    ), // Replace with actual icon
    title: 'Repair',
    desc: 'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
  },
];

interface StepProjectTypeProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
  cancelButtonClass?: string;
}

export function StepProjectType({
  selectedType,
  setSelectedType,
  onPrev,
  onSubmit,
  cancelButtonClass,
}: StepProjectTypeProps) {
  return (
    <div className='w-full max-w-[846px] bg-white rounded-2xl shadow p-10 flex flex-col items-center'>
      <h2 className='text-2xl font-bold text-center mb-2'>
        Which type of project do you need for your home?
      </h2>
      <p className='text-gray-500 text-center mb-8 max-w-lg'>
        Choose the project category to help us provide accurate planning and
        estimates.
      </p>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {PROJECT_TYPES.map(type => (
          <div
            key={type.key}
            className={`flex flex-col items-start border border-gray-200 rounded-2xl bg-white shadow-sm p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${selectedType === type.key ? 'border-green-500 shadow-green-100' : ''}`}
            onClick={() => setSelectedType(type.key)}
          >
            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 mb-4'>
              {type.icon}
            </div>
            <div className='font-semibold text-lg mb-1 text-gray-900'>
              {type.title}
            </div>
            <div className='text-gray-500 text-base'>{type.desc}</div>
          </div>
        ))}
      </div>
      <div className='flex w-full justify-between mt-6'>
        <button
          type='button'
          className={
            cancelButtonClass ||
            'h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          }
          onClick={onPrev}
        >
          Previous
        </button>
        <button
          type='button'
          className='bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-full font-semibold'
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
