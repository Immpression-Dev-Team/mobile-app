import SectionTemplate from "../SectionTemplate/Section";
import FeaturedArtists from "./FeaturedArtists";

export default function FeaturedArtistsSection(){
    return(
        <SectionTemplate
            sectionName='FeaturedArtists'
            renderSection={<FeaturedArtists/>}
            height={38}
            headerHeight={10}
            footerHeight={10}
        />
    )
}