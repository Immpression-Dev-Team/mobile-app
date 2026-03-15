import SectionTemplate from "../SectionTemplate/Section";
import ArtForYou from "./ArtForYou";

export default function CategoryNavSection(){
    return(
        <SectionTemplate renderSection={<ArtForYou/>} />
    )
}