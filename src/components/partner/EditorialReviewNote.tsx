import { editorialReviewedDate, isEditorialReviewed } from "@/data/editorialReviewed";

interface Props {
  slug: string | null | undefined;
  className?: string;
}

/**
 * Källkvalitetsetikett under d365.se:s bedömningar.
 * Redaktionellt granskade profiler får den starkare etiketten;
 * övriga behåller standardetiketten om AI-assisterad sammanställning.
 */
const EditorialReviewNote = ({ slug, className = "" }: Props) => {
  if (isEditorialReviewed(slug)) {
    const date = editorialReviewedDate(slug);
    return (
      <p className={className}>
        Redaktionellt granskad av D365.SE{date ? ` ${date}` : ""}. Bedömningen är oberoende och
        inte godkänd av partnern. AI har använts som stöd vid sammanställningen.
      </p>
    );
  }
  return (
    <p className={className}>
      AI-assisterad sammanställning. Kan innehålla fel och är inte granskad av partnern.
    </p>
  );
};

export default EditorialReviewNote;
