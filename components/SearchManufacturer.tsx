"use client";

import { SearchManufacturerProps } from '@/types'
import { Combobox, Transition } from '@headlessui/react'
import Image from 'next/image';
import { useState, Fragment } from 'react';
import { manufacturers } from '@/constants';
import { resolveTripleslashReference } from 'typescript';

const SearchManufacturer = ({selected, setSelected}: SearchManufacturerProps) => {
    const [query, setQuery] = useState('')
    const filteredManufacturer = 
        query === "" 
            ? manufacturers
            : manufacturers.filter((item) => (
                item.toLowerCase()
                    .replace('/\s+g', "") 
                    .includes( query.toLowerCase().replace('/\s+g', "") )
            ))
  return (
    <div className='search-manufacturer'>
        <Combobox value={selected} onChange={setSelected}>
            <div className='relative w-full'>
                <Combobox.Button className='absolute top-[14px]'>
                    <Image 
                        src='/car-logo.svg'
                        height={20}
                        width={20}
                        className='ml-4'
                        alt='Car Logo'
                    />
                </Combobox.Button>

                <Combobox.Input 
                    className='search-manufacturer__input'
                    placeholder='Volkswagen'
                    displayValue={(manufacturer: string) => manufacturer}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <Transition 
                    as={Fragment}
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity'
                    leaveTo='opacity'
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options>
                        {filteredManufacturer.length === 0 && query !== "" ? (
                            <Combobox.Option 
                                value={query}
                                className='search-manufacturer__option'
                                >
                                    Create {`${query}`}
                            </Combobox.Option>
                        ) : (
                            filteredManufacturer.map((item) => (
                                <Combobox.Option 
                                key={item}
                                className={({active})=> `relative search-manufacturer__option ${active ? 'bg-primary-blue text-white' : 'text-gray-900'}`}
                                value={item}
                                >
                                {({selected, active})=> {
                                    return (
                                        <>
                                        <span
                                          className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                          }`}
                                            >
                                            {item}
                                            </span>
                                            {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active ? 'text-white' : 'text-teal-600'
                                                }`}
                                            >
                                                {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                          </span>
                                        ) : null}
                                      </>
                                    )
                                }}
                            </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    </div>
  )
}

export default SearchManufacturer