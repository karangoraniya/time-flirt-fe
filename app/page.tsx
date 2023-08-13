import Image from 'next/image';
import { LiaCapsulesSolid } from 'react-icons/lia';
import { flirt_1, flirt_2, flirt_bg } from '../public/assets/index';
import Link from 'next/link';
export default function Home() {
  return (
    <main className="bg-gradient-to-r from-black  via-purple-900 to-black">
      {/* hero section */}
      <div className="container h-[100vh] w-full flex justify-evenly items-center  bg-cover bg-center bg-no-repeat bg-Custom ">
        <p className="font-extrabold text-[50px] w-[70%] ">
          Memories Sealed in Time, Unleashed as NFTs: Explore TimeFlirt&apos;s
          Unique Fusion
        </p>
      </div>
      {/* hero section complete  */}
      {/* featuers section  start */}
      <div className="mian_section w-full my-3 flex-col justify-center gap-5 ">
        {/* card 1 */}
        <div className="card1 flex md:flex-row flex-col md:gap-[100px] gap-[50px] justify-center items-center md:mb-0 mb-5">
          {/* img */}
          <div>
            <Image
              src={flirt_1}
              alt="Time Flirt"
              className="h-[300px] w-[300px] rounded-md"
            />
          </div>
          {/* content */}
          <div className="texts w-[400px] text-start flex flex-col md:h-[150px] h-fit ">
            <p className="text-[20px] font-bold  ">
              Create your personalized Time Flirt Capsules.
            </p>
            <p className="text2">
              Seal your NFTs in our innovative capsules, designed to withstand
              the test of time, and open them when it feels right.
            </p>
          </div>
        </div>

        {/* card 2 */}
        <div className="card1 flex md:flex-row-reverse flex-col-reverse gap-[100px] justify-center items-center">
          {/* img */}
          <div>
            <Image
              src={flirt_2}
              alt="Time Flirt"
              className="h-[300px] w-[300px] rounded-md"
            />
          </div>
          {/* content */}
          <div className="texts w-[400px] text-start flex flex-col md:h-[150px] h-fit ">
            <p className="text-[20px] font-bold  ">
              Unlock endless possibilities in the future.
            </p>
            <p className="text2">
              As time progresses, discover new layers of meaning and value
              within your capsules.
            </p>
          </div>
        </div>
      </div>
      {/* featuers section  end  */}

      {/* get started */}
      <div className="flex flex-col justify-center items-center w-full my-[16%]">
        <p className="text1 text-[30px] font-bold">Get Started</p>
        <p className="text2 text-center w-[400px] font-light text-[#A6E1FA]/[0.50]">
          Ready to flirt with the future? Begin your journey and mint your Time
          Flirt Capsules today.
        </p>
        <Link href="/mint-capsule">
          <button className="bg-purple-950/[0.70] p-3 rounded-lg flex items-center gap-2 mt-3">
            Mint Capsules
            <LiaCapsulesSolid className="text-[25px] font-light " />
          </button>
        </Link>
      </div>
    </main>
  );
}
