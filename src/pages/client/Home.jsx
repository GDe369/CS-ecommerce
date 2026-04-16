import FlashSale from "./HomeComponents/FlashSale";
import BestSellers from "./HomeComponents/BestSellers";
import TopViewed from "./HomeComponents/TopViewed";
import MainSlider from "./HomeComponents/MainSlider";
import TopRated from "./HomeComponents/TopRated";
export default function Home() {
  return (
    <div className="space-y-24 pb-20 pt-10">
      <MainSlider />
      <TopRated />

      <FlashSale />

      <BestSellers />

      <TopViewed />
    </div>
  );
}
