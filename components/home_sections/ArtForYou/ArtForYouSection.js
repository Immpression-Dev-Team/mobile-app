import SectionTemplate from "../SectionTemplate/Section";
import ArtForYou from "./ArtForYou";

export default function CategoryNavSection(){
    return(
        <SectionTemplate
            renderSection={<ArtForYou/>}
            height={48}
            marginHeight={1.5}
        />
    )
}