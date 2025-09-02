import SectionTemplate from "../SectionTemplate/Section";
import FeaturedArtists from "./FeaturedArtists";

export default function FeaturedArtistsSection(){
    return(
        <SectionTemplate
            renderSection={<FeaturedArtists/>}
            height={35}
            marginHeight={1.25}
        />
    )
}