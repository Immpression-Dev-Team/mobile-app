import SectionTemplate from "../SectionTemplate/Section";
import ArtForYou from "./ArtForYou";

export default function ArtForYouSection(){
    return(
        <SectionTemplate
            renderSection={<ArtForYou/>}
            height={51}
        />
    )
}