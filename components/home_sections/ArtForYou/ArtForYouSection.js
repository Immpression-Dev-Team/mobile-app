import SectionTemplate from "../SectionTemplate/Section";
import ArtForYou from "./ArtForYou";

export default function ArtForYouSection(){
    return(
        <SectionTemplate
            sectionName='ArtForYou'
            renderSection={<ArtForYou/>}
            height={50}
            headerHeight={5}
            footerHeight={9.5}
        />
    )
}