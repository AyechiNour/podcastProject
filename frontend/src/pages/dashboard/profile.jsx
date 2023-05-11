import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Typography,
    Button,
    Alert,
} from "@material-tailwind/react";
import {

    InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { MessageCard } from "@/widgets/cards";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

export function Profile() {
    const [Article, setArticle] = useState(null);
    const [audioUrls, setAudioUrls] = useState({});
    const [Audio, setAudio] = useState(null);
    const [Success, setSuccess] = useState(false);
    const [formErrors, updateFormErrors] = useState({});
    const Token = localStorage.getItem('token')
    const [formErrorsAudio, updateFormErrorsAudio] = useState({});
    const [userName, setUserName] = useState("");
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        async function decodeToken() {
            try {
                const tokenDecoded = await axios.post('http://localhost:3000/authorisation/decodeToken', { tokenUser: Token })
                setUserName(tokenDecoded.data.token.payload.nameUser)
            } catch (error) {
                console.log(error)
            }
        }
        decodeToken();
    }, []);

    useEffect(() => {
        let errors = {};
        async function fetchData() {
            let errors = {};
            try {
                const allArticles = await axios.post('http://localhost:3000/article/getArticleNonConverted', { token: Token })
                if (_.isEmpty(allArticles.data.articles)) {
                    errors = { ...errors, error: 'Empty data' };
                    updateFormErrors(errors);
                } else {
                    setArticle(allArticles.data.articles)
                    console.log(Article)
                    console.log(update)
                }
            } catch (error) {
                errors = { ...errors, error: "Something went wrong, please try again later" }
                updateFormErrors(errors);
            }
        }
        fetchData()
    }, [update]);

    useEffect(() => {
        let errors = {};
        async function fetchAudioUrls() {
            await axios.post('http://localhost:3000/audio/getAudio', { token: Token })
                .then(async response => {
                    const audioArray = response.data.audios;
                    if (_.isEmpty(audioArray)) {
                        errors = { ...errors, error: 'Empty data' };
                        updateFormErrorsAudio(errors);
                    } else {
                        setAudio(response.data.audios)
                    }
                    const urls = {};

                    for (const audio of audioArray) {
                        const response = await axios.get(`http://localhost:3000/audio/uploads/${audio.url}`, { responseType: 'blob' });
                        const objectUrl = URL.createObjectURL(response.data);
                        urls[audio.id] = objectUrl;
                    }

                    setAudioUrls(urls);
                }).catch((error) => {
                    errors = { ...errors, error: "Something went wrong, please try again later" }
                    updateFormErrorsAudio(errors);
                });
        }
        fetchAudioUrls();
    }, [update]);

    const handleVoice = async (id, subject, content) => {
        setUpdate(!update);
        setSuccess(false)
        await axios.post("http://localhost:3000/audio/addAudio", { id: id, subject: subject, content: content })
            .then((response) => {
                if (response.data.status) {
                    setSuccess(true)
                    window.alert("L'article est bien converti en audio")
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover	bg-center bg-img" >
                <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
                <CardBody className="p-4">
                    <div className="mb-10 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <img className="w-20 h-20" src="/img/user.jpg" alt="" srcset="" />
                            <div>
                                <Typography variant="h5" color="blue-gray" className="mb-1">
                                    {userName}
                                </Typography>
                            </div>
                        </div>
                       
                    </div>
                    <div className="mb-12 px-4">
                       
                      
                        <Typography variant="h6" color="blue-gray" className="mb-3">
                            Articles
                        </Typography>
                        {(!_.isEmpty(formErrors["error"])) ?
                            <div>
                                <Alert
                                    color="orange"
                                    icon={
                                        <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                                    }
                                >
                                    Until now, there's no non converted articles. Could you please add one?
                                </Alert>
                            </div>
                            :
                            <ul className="flex flex-col gap-6">
                                {Article != null &&
                                    Article.map(({ id, subject, content }) => (
                                        <div className="flex flex-row items-center">
                                            <MessageCard

                                                key={id}
                                                name={subject}
                                                message={content}
                                            />
                                            <Link className="ml-2" >
                                                <Button variant="outlined" size="sm" onClick={() => { handleVoice(id, subject, content)}}>
                                                    Convert
                                                </Button>
                                            </Link>
                                        </div>

                                    ))}
                            </ul>
                        }
                    </div>
                    <div className="px-4 pb-4">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Audios
                        </Typography>
                        {(!_.isEmpty(formErrorsAudio["error"])) ?
                            <div>
                                <Alert
                                    color="orange"
                                    icon={
                                        <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                                    }
                                >
                                    Until now, no audios have been added. Could you please add one?
                                </Alert>
                            </div>
                            :
                            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-2">
                                {Audio != null && audioUrls &&
                                    Audio.map(({ id, subject, url }) => (
                                        <Card className="drop-shadow-md border p-4" key={subject} color="transparent" shadow={false}>
                                            <CardHeader
                                                floated={false}
                                                color="gray"
                                                className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                                            >
                                                <img
                                                    src={"/img/podcast1.jpg"}
                                                    alt={subject}
                                                    className="h-full w-full object-cover"
                                                />
                                            </CardHeader>
                                            <CardBody className="py-0 px-1">
                                                <Typography
                                                    variant="h5"
                                                    color="blue-gray"
                                                    className="mt-1 mb-2"
                                                >
                                                    {subject}
                                                </Typography>
                                            </CardBody>
                                            <CardFooter className="mt-6 flex items-center justify-center py-0 px-1">
                                                <div>
                                                    <audio controls src={audioUrls[id]}></audio>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    )
                                    )}
                            </div>}
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default Profile;
