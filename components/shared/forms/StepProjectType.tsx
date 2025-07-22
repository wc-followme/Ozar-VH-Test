import { FlagHookIcon } from '../../icons/FalgHookIcon';

const PROJECT_TYPES = [
  {
    key: 'full_home',
    icon: FlagHookIcon,
    title: 'Full Home Build/Addition',
    desc: 'Start a new home from scratch or add a room, floor, or extension to your existing space.',
    iconColor: 'text-[#EBB402]',
    bgColor: 'bg-[#EBB4021A]',
  },
  {
    key: 'interior',
    icon: FlagHookIcon,
    title: 'Interior',
    desc: 'Renovate or upgrade interiors like kitchen, bathroom, living room, or complete home redesign.',
    iconColor: 'text-[#EBB402]',
    bgColor: 'bg-[#EBB4021A]',
  },
  {
    key: 'exterior',
    icon: FlagHookIcon,
    title: 'Exterior',
    desc: 'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    iconColor: 'text-[#EBB402]',
    bgColor: 'bg-[#EBB4021A]',
  },
  {
    key: 'multi_trade',
    icon: FlagHookIcon,
    title: 'Single/Multi Trade',
    desc: 'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
    iconColor: 'text-[#EBB402]',
    bgColor: 'bg-[#EBB4021A]',
  },
  {
    key: 'repair',
    icon: FlagHookIcon,
    title: 'Repair',
    desc: 'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
    iconColor: 'text-[#EBB402]',
    bgColor: 'bg-[#EBB4021A]',
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
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        Which type of project do you need for your home?
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        Choose the project category to help us provide accurate planning and
        estimates.
      </p>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 h-[calc(100vh_-_550px)] overflow-y-auto'>
        {PROJECT_TYPES.map(
          ({ icon: Icon, key, bgColor, iconColor, title, desc }) => {
            return (
              <div
                key={key}
                className={`flex flex-col items-start border border-[var(--border-dark)] rounded-2xl bg-[var(--card-background)]  p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${selectedType === key ? 'bg-[var(--card-hover)] shadow-green-100' : ''}`}
                onClick={() => setSelectedType(key)}
              >
                <div
                  className={`w-10 h-10 rounded-[16px] ${bgColor} ${iconColor} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 `} color='currentcolor' />
                </div>
                <div className='font-bold text-base mb-2 text-[var(--text-dark)]'>
                  {title}
                </div>
                <div className='text-[var(--text-secondary)] text-base font-normal leading-snug'>
                  {desc}
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className='flex w-full justify-between'>
        <button
          type='button'
          className={cancelButtonClass || 'btn-secondary !h-12 !px-8'}
          onClick={onPrev}
        >
          Previous
        </button>
        <button
          type='button'
          className='btn-primary !h-12 !px-12'
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
