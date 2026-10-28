import HeaderDesktop from "../components/HeaderDesktop";
import ListCardBanner from "../components/ListCardBanner";
import CarouselTodayDeals from "../components/CarouselTodayDeals";
import Category from "../components/Category";

export default function Home() {
  return (
    <div>
      <HeaderDesktop />
      <main className="container home-content">
        <ListCardBanner />
        <Category variant="carousel" />
        <CarouselTodayDeals />
      </main>
    </div>
  );
}
