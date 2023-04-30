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
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactAudioPlayer from 'react-audio-player';
import lamejs from 'lamejs';

import { useSpeechSynthesis } from 'react-speech-kit';
export function Profile() {
  const [validate, setvalidate] = useState(false)
  const [Article, setArticle] = useState(null);

  const Token = localStorage.getItem('token')
  console.log("Token", Token)

  useEffect(() => {
    console.log("okkkk")
    async function fetchData() {
      try {
        const allArticles = await axios.post('http://localhost:3000/article/getArticle', { token: Token })
        console.log("from profile", allArticles.data.articles)
        setArticle(allArticles.data.articles)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
    console.log(Article)
  }, [validate]);

  const handleVoice = async (id, subject, content) => {
    const synth = window.speechSynthesis; 
    const utterance = new SpeechSynthesisUtterance(content);
    synth.speak(utterance);
    utterance.onend = () => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(
        synth.getAudioContext().destination.stream
      );
      const recorder = new MediaRecorder(source);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "audio.wav";
        link.click();
        URL.revokeObjectURL(url);
      };

      setTimeout(() => {
        recorder.stop();
      }, 2000);
    }
      // const formData = new FormData();
      // formData.append("id", id);
      // formData.append("subject", subject);
      // formData.append("audio", audioUrl );
    
      // const config = {
      //   headers: { 'content-type': 'multipart/form-data' }
      // };
    
      // await axios.post("http://localhost:3000/audio/addAudio", formData, config)
      //   .then((response) => {
      //     console.log("Audio saved successfully.");
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
 
  
    

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
              <Avatar
                src="/img/team-3.jpeg"
                alt="bruce-mars"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Ayechi Nour
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
            <ul className="flex flex-col gap-6">
              {Article != null &&
                Article.map(({ id, subject, content }) => (
                  <MessageCard
                    key={id}
                    name={subject}
                    message={content}
                    action={
                      <Button onClick={() => { handleVoice(id, subject, content) }} variant="text" size="sm">
                        convert
                      </Button>
                    }
                  />
                ))}
            </ul>

          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Audios
            </Typography>

            {/* <ReactAudioPlayer
              src="my_audio_file.ogg"
              autoPlay
              controls
            /> */}

            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {projectsData.map(
                ({ img, title, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <div>
                        <img src="/img/nivAudio1.jpg" alt="" srcset="" />
                        {/* <Button variant="outlined" size="sm">
                          Start
                        </Button>
                        <Button variant="outlined" size="sm">
                          Stop
                        </Button> */}
                      </div>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
