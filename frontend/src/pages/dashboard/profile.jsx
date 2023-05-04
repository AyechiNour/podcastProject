import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Switch,
    Tooltip,
    Button,
    Alert,
} from "@material-tailwind/react";
import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

export function Profile() {
    const [validate, setvalidate] = useState(false)
    const [Article, setArticle] = useState(null);
    const [audioUrls, setAudioUrls] = useState({});
    const [Audio, setAudio] = useState(null);
    const [Success, setSuccess] = useState(false);
    const [formErrors, updateFormErrors] = useState({});
    const Token = localStorage.getItem('token')
    const [formErrorsAudio, updateFormErrorsAudio] = useState({});
    const [userName, setUserName] = useState("");
    
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
                }
            } catch (error) {
                errors = { ...errors, error: "Something went wrong, please try again later" }
                updateFormErrors(errors);
            }
        }
        fetchData()
    }, [validate]);

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
    }, [validate]);

    const handleVoice = async (id, subject, content) => {
        setSuccess(false)
        await axios.post("http://localhost:3000/audio/addAudio", { id: id, subject: subject, content: content })
            .then((response) => {
                if (response.data.status) {
                    // window.location.reload()
                    setvalidate(true)
                    setSuccess(true)
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
                        {/* <div className="w-96">
                <Tabs value="app">
                  <TabsHeader>
                    <Tab value="app">
                      <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                      App
                    </Tab>
                    <Tab value="message">
                      <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                      Message
                    </Tab>
                    <Tab value="settings">
                      <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                      Settings
                    </Tab>
                  </TabsHeader>
                </Tabs>
              </div> */}
                    </div>
                    <div className="mb-12 px-4">
                        {/* <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Platform Settings
                </Typography>
                <div className="flex flex-col gap-12">
                  {platformSettingsData.map(({ title, options }) => (
                    <div key={title}>
                      <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                        {title}
                      </Typography>
                      <div className="flex flex-col gap-6">
                        {options.map(({ checked, label }) => (
                          <Switch
                            key={label}
                            id={label}
                            label={label}
                            defaultChecked={checked}
                            labelProps={{
                              className: "text-sm font-normal text-blue-gray-500",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
                        {/* <ProfileInfoCard
                title="Profile Information"
                description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                details={{
                  "first name": "Alec M. Thompson",
                  mobile: "(44) 123 1234 123",
                  email: "alecthompson@mail.com",
                  location: "USA",
                  social: (
                    <div className="flex items-center gap-4">
                      <i className="fa-brands fa-facebook text-blue-700" />
                      <i className="fa-brands fa-twitter text-blue-400" />
                      <i className="fa-brands fa-instagram text-purple-500" />
                    </div>
                  ),
                }}
                action={
                  <Tooltip content="Edit Profile">
                    <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                  </Tooltip>
                }
              /> */}
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
                                        <><MessageCard
                                            key={id}
                                            name={subject}
                                            message={content}
                                            action={
                                                <Button onClick={() => { handleVoice(id, subject, content) }} variant="text" size="sm">
                                                    convert
                                                </Button>
                                            }
                                        />
                                            {Success && <span>audio ok</span>}
                                        </>

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
                            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
                                {Audio != null && audioUrls &&
                                    Audio.map(({ id, subject, url }) => (
                                        <Card key={subject} color="transparent" shadow={false}>
                                            <CardHeader
                                                floated={false}
                                                color="gray"
                                                className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                                            >
                                                <img
                                                    src={"/img/audio1.png"}
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
                                            <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
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
