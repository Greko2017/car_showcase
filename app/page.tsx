"use client";
import { CarCard, CustomFilter, Hero, SearchBar } from '@/components'
import ShowMore from '@/components/ShowMore';
import { fuels, yearsOfProduction } from '@/constants';
import { FilterProps } from '@/types';
import { fetchCars } from '@/utils'
import { useEffect, useState } from 'react';
import Image from 'next/image';
export default function Home({searchParams} : {searchParams : FilterProps} ) {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // search states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter states
  const [fuel, setFuel] = useState("")
  const [year, setYear] = useState(2022)

  // state pagination
  const [limit, setLimit] = useState(10)
  
  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model])
  
  const getCars = async () => {
    try {    
      setLoading(true);
      const result = await fetchCars({
        manufacturer: manufacturer || '', 
        year: year || 2022, 
        fuel: fuel || '', 
        limit: limit || 10, 
        model: model || '', 
      });
      setAllCars(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className='home__filters' id='home__filters'>
          <SearchBar setManufacturer={setManufacturer} setModel={setModel}/>

          <div className='home__filter-container'>
            <CustomFilter setFilter={setFuel} title='fuel' options={fuels}/>
            <CustomFilter setFilter={setYear} title='year' options={yearsOfProduction}/>
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className='home__cars-wrapper'>
                {allCars?.map((car) => (                
                    <CarCard car={car} />
                  )                 
                )}
            </div>

            {loading && (
              <div className=' -ml-[50px] -mb-10 mt-16 w-full flex-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" overflow="visible" fill="#0b59ec" stroke="#0b59ec"><defs><circle id="loader" r="4" cx="50" cy="50" transform="translate(0 -30)"/></defs><use xlinkHref="#loader" x="10"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.17s" repeatCount="indefinite"></animate></use><use xlinkHref="#loader" x="26"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.33s" repeatCount="indefinite"></animate></use><use xlinkHref="#loader" x="42"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.50s" repeatCount="indefinite"></animate></use><use xlinkHref="#loader" x="58"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.67s" repeatCount="indefinite"></animate></use><use xlinkHref="#loader" x="74"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.83s" repeatCount="indefinite"></animate></use><use xlinkHref="#loader" x="90"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="1.00s" repeatCount="indefinite"></animate></use></svg>
              </div>
            )}
            {allCars.length > 0 && <ShowMore
              pageNumber={limit / 10} 
              isNext={() => {
                console.log('limit > allCars.length :>> ', limit > allCars.length);
                return (limit > allCars.length)
              }}
              setLimit={setLimit}
              />}
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl text-bold'>Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  )
}
