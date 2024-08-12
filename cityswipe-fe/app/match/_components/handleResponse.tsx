import { DestinationItem } from "@/lib/destination.type";
import { Card, CardSwipeDirection } from "@/lib/games.type";

type Props = {
  direction: CardSwipeDirection | "";
  cards: Card[];
  destinations: DestinationItem[];
};

const handleResponse = ({ direction, cards, destinations }: Props) => {
  // Get the last card from the cards array
  const currentCard = cards[cards.length - 1];
  // Determine if the direction is "right" and set choice accordingly
  const choice = "right" === direction ? "true" : "false";
  // Get the image URL from the current card or set to empty string if not available
  const imgUrl = currentCard.illustration ? currentCard.illustration : '';
  // If the choice is "true", add the current card details to destinations array
  // choice ? destinations.push({id:cards.length-1, location:currentCard.location, rating:currentCard.rating, img:imgUrl}) : null;
  choice ? destinations.push({id:cards.length-1, location:currentCard.location, rating:currentCard.rating}) : null;
  // Return the updated destinations array
  console.log("destinations", destinations);
  return destinations;
};

export default handleResponse;