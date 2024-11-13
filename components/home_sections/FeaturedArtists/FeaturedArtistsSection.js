import SectionTemplate from "../SectionTemplate/Section";
import FeaturedArtists from "./FeaturedArtists";

export default function FeaturedArtistsSection(){
    return(
        <SectionTemplate
            renderSection={<FeaturedArtists/>}
            height={36}
            headerHeight={10}
            footerHeight={2.5}
        />
    )
}