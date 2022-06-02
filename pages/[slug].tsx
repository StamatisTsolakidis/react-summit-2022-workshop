import {GetStaticPaths, GetStaticProps} from "next"
import Nav from "../components/Nav"
import KontentService from "../services/KontentService"
import {LandingPageModel} from "../models/LandingPageModel";
import {projectModel} from "../models/_project";
import {RichTextElement} from "@simply007org/kontent-react-components";
import {ComponentCtaModel} from "../models/ComponentCtaModel";
import {ComponentHeroModel} from "../models/ComponentHeroModel";
import {ComponentTextWithImageModel} from "../models/ComponentTextWithImageModel";
import Cta from "../components/Cta";
import Hero from "../components/Hero";
import TextWithImage from "../components/TextWithImage";
import {INavComponents} from "../interfaces/INavComponents";


export const getStaticPaths: GetStaticPaths = async () => {
const pathsResponse = await KontentService.Instance().deliveryClient
    .items<LandingPageModel>()
    .type(projectModel.contentTypes.landing_page.codename)
    .elementsParameter([
        projectModel.contentTypes.landing_page.elements.url_slug.codename
    ])
    .toPromise()

    return {
        paths: pathsResponse.data.items.map(path => ({
            params: {
                slug: path.elements.urlSlug.value
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<LandingPageModel> = async ({ params }) => {
    const slug = params.slug.toString();

    const page = await KontentService.Instance().deliveryClient
        .items<LandingPageModel>()
        .type(projectModel.contentTypes.landing_page.codename)
        .equalsFilter(
            `elements.${projectModel.contentTypes.landing_page.elements.url_slug.codename}`, slug
        )
        .limitParameter(1)
        .toPromise()

    return {
        props: page.data.items[0]
    }
}
const LandingPage: React.FC<LandingPageModel> = (page) => {
    return (
        <main>
            <Nav data={page.elements.content.linkedItems as INavComponents['data']} />
            <div>
                <RichTextElement
                    richTextElement={page.elements.content}
                    resolvers={{
                        resolveLinkedItem: (linkedItem => {
                            switch (linkedItem.system.type) {
                                case projectModel.contentTypes._component__cta.codename:
                                    return <Cta {...(linkedItem as ComponentCtaModel)} />;
                                case projectModel.contentTypes._component__hero.codename:
                                    return <Hero {...(linkedItem as ComponentHeroModel)} />
                                case projectModel.contentTypes._component__text_with_image.codename:
                                    return <TextWithImage {...linkedItem as ComponentTextWithImageModel} />
                            }
                        }),

                    }}
                />
            </div>
        </main>
    )
}

export default LandingPage
