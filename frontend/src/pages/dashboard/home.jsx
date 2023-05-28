import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  UserIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";


import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

export function Home() {
  const [Article, setArticle] = useState(null);
  const [Articles, setArticles] = useState(null);

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
          console.log("audio ------------------",audioArray)
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

  useEffect(() => {
    async function fetchData() {
      let errors = {};
      try {
        const allArticles = await axios.post('http://localhost:3000/article/getArticle', { token: Token })
        if (_.isEmpty(allArticles.data.articles)) {
          errors = { ...errors, error: 'Empty data' };
          updateFormErrors(errors);
        } else {
          setArticles(allArticles.data.articles)
        }
      } catch (error) {
        errors = { ...errors, error: "Something went wrong, please try again later" }
        updateFormErrors(errors);
      }
    }
    fetchData()
  }, []);

const handleVoice = async (id, subject, content) => {
    setUpdate(!update);
    setSuccess(false)
    await axios.post("http://localhost:3000/audio/addAudio", { id: id, subject: subject, content: content, token: Token })
      .then((response) => {
        if (response.data.status) {
          setSuccess(true)
          console.log(update)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

const statisticsCardsData = [
    {
      color: "blue",
      icon: BanknotesIcon,
      title: "Number of Articles",
      value: Articles != null ? Articles.length : 0,
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
    {
      color: "pink",
      icon: UserIcon,
      title: "Non Converted",
      value: Article != null ? Article.length : 0,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "orange",
      icon: ChartBarIcon,
      title: "Number of Audio",
      value: Audio != null ? Audio.length : 0,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ];

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      <Card className="mx-3 mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
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
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckIcon strokeWidth={3} className="h-4 w-4 text-blue-500" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Home;
