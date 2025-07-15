import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageUpload } from '../ImageUpload';
import SelectField from '../common/SelectField';

export function CompanyInfoForm() {
  const [contractorCountry, setContractorCountry] = useState('us');
  const [companyCountry, setCompanyCountry] = useState('us');

  // const router = useRouter();
  // const handleCreateClick = () => {
  //   router.push('/company-management/add-user');
  // };
  const handleUploadClick = () => {
    console.log('Upload clicked');
  };
  return (
    <form className=''>
      {/* Company Information */}
      <div>
        <h2 className='text-lg font-bold mb-4'>Company Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label
              htmlFor='company-name'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Company Name
            </Label>
            <Input
              id='company-name'
              placeholder='Enter company name'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='tagline'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Tagline
            </Label>
            <Input
              id='tagline'
              placeholder='Enter tagline'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
        </div>
        <div className='space-y-2 mt-4'>
          <Label
            htmlFor='about'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            About
          </Label>
          <Textarea
            id='about'
            placeholder='Type a description of your company'
            className='rounded-[10px] min-h-[80px] border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter company email'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Phone Number
            </Label>
            <div className='flex w-full'>
              <Select value={companyCountry} onValueChange={setCompanyCountry}>
                <SelectTrigger className='h-12 w-24 rounded-l-[10px] rounded-r-none border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                  <SelectItem value='us'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs'>🇺🇸</span>
                      <span>+1</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='uk'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs'>🇬🇧</span>
                      <span>+44</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='in'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs'>🇮🇳</span>
                      <span>+91</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                id='phone'
                placeholder='Enter Number'
                className='h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]'
              />
            </div>
          </div>
        </div>
        <div className='space-y-2 mt-4'>
          <Label
            htmlFor='address'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Address
          </Label>
          <Input
            id='address'
            placeholder='Enter Company Address'
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div className='space-y-2'>
            <Label
              htmlFor='city'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              City
            </Label>
            <Input
              id='city'
              placeholder='Enter City'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='pin-code'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Pin Code
            </Label>
            <Input
              id='pin-code'
              placeholder='Enter Pin Code'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div className='space-y-2'>
            <SelectField
              label='Preferred Method of Communication'
              value={''}
              onValueChange={() => {}}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'sms', label: 'SMS' },
                { value: 'slack', label: 'Slack' },
                { value: 'teams', label: 'Microsoft Teams' },
              ]}
              placeholder='eg: email, phone, etc.'
              error={''}
              className=''
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='website'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              Website
            </Label>
            <Input
              id='website'
              placeholder='eg: yourwebsite.com'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
        </div>
      </div>

      {/* Contractor Information (Optional) */}
      <div className='mt-5'>
        <h2 className='text-lg font-bold mb-4'>
          Contractor Information{' '}
          <span className='text-sm font-normal text-gray-500'>(Optional)</span>
        </h2>
        <div className='grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-5 gap-6 items-end'>
          <div className='md:col-span-1 w-[220px] flex-shrink-0 bg-[var(--white-background)]'>
            <ImageUpload
              onClick={handleUploadClick}
              label='Upload Photo'
              // icon={<ChevronRight className='h-4 w-4 mx-2' />}
              className='h-[180px]'
              // text={''}
            />
          </div>
          <div className='xl:col-span-2 2xl:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2 md:col-span-2'>
              <Label
                htmlFor='contractor-name'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Contractor Name
              </Label>
              <Input
                id='contractor-name'
                placeholder='Enter Full name'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <div className='space-y-2 md:col-span-1'>
              <Label
                htmlFor='contractor-email'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Email
              </Label>
              <Input
                id='contractor-email'
                type='email'
                placeholder='Enter email'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <div className='space-y-2 md:col-span-1'>
              <Label
                htmlFor='contractor-phone'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Phone Number
              </Label>
              <div className='flex w-full'>
                <Select
                  value={contractorCountry}
                  onValueChange={setContractorCountry}
                >
                  <SelectTrigger className='h-12 w-24 rounded-l-[10px] rounded-r-none border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                    <SelectItem value='us'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs'>🇺🇸</span>
                        <span>+1</span>
                      </div>
                    </SelectItem>
                    <SelectItem value='uk'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs'>🇬🇧</span>
                        <span>+44</span>
                      </div>
                    </SelectItem>
                    <SelectItem value='in'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs'>🇮🇳</span>
                        <span>+91</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id='contractor-phone'
                  placeholder='Enter Number'
                  className='h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className='flex justify-end gap-6 mt-8'>
        <Link
          href={'/company-management'}
          className='inline-flex items-center h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)]'
        >
          Cancel
        </Link>
        <Link
          href={'/company-management/add-user'}
          className='inline-flex items-center h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
        >
          Create
        </Link>
        {/* <Button
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
          onClick={handleCreateClick}
        >
          Create
        </Button> */}
      </div>
    </form>
  );
}
