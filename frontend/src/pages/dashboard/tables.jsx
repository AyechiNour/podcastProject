import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Input,
  Button,
  Alert,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { Link } from "react-router-dom";
import { MessageCard } from "@/widgets/cards";
import axios from 'axios';
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import _ from "lodash";

export function Tables() {
  const [validate, setvalidate] = useState(false)
  const refSubject = useRef(null)
  const contentRef = useRef(null)
  const [value, setvalue] = useState("")
  const [Article, setArticle] = useState(null)
  const Token = localStorage.getItem('token')
  const [formErrors, updateFormErrors] = useState({});
  const [content, setContent] = useState("");
  const [text, setText] = useState(" ");
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let errors = {};
      try {
        const allArticles = await axios.post('http://localhost:3000/article/getArticle', { token: Token })
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
    let currentText = "";
    let index = 0;

    const intervalId = setInterval(() => {
      currentText += text[index];
      setContent(currentText);
      index++;

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 40);

    return () => {
      clearInterval(intervalId);
    };
  }, [text]);

  const generateArticle = async () => {
    try {
      setAppear(true)
      var subject = refSubject.current.getElementsByTagName('input')[0].value
      const content = await axios.post('http://localhost:3000/article/generateArticle', { subject: subject })
      // setText(content.data.articles)
      setText("L'univers est un lieu mystérieux et fascinant, rempli de phénomènes étranges et de questions sans réponse. Malgré des avancées considérables en astronomie et en physique, il reste encore beaucoup à découvrir sur l'univers et ses mystères.L'un des mystères les plus intrigants de l'univers est la question de la matière noire. Les scientifiques ont observé que la matière visible ne représente qu'une infime partie de la matière totale de l'univers, ce qui suggère l'existence d'une forme de matière invisible, la matière noire. Bien que les scientifiques aient des preuves indirectes de l'existence de la matière noire, ils ne savent pas encore exactement ce qu'elle est ni comment elle fonctionne.Un autre mystère de l'univers est la question de l'énergie noire. L'énergie noire est une forme d'énergie qui est censée être responsable de l'expansion accélérée de l'univers. Les scientifiques ne savent pas encore ce qu'est exactement l'énergie noire, mais ils pensent qu'elle représente environ 70% de l'univers.Un troisième mystère de l'univers est la question de l'origine de la vie et de son évolution dans l'univers. Les scientifiques ont découvert des milliers de planètes en dehors de notre système solaire qui pourraient être potentiellement habitables, mais ils ne savent pas encore comment la vie est apparue et s'est développée sur Terre, ni si elle s'est développée de la même manière ailleurs dans l'univers.Un autre mystère de l'univers est la question des trous noirs. Les trous noirs sont des zones de l'espace où la gravité est si intense que rien ne peut s'échapper, pas même la lumière. Les scientifiques cherchent encore à comprendre comment les trous noirs se forment, comment ils évoluent et comment ils affectent l'univers.En somme, l'univers est rempli de mystères et de questions sans réponse. Les scientifiques continuent de chercher des réponses à ces questions en utilisant des télescopes de pointe, des simulations informatiques et des expériences en laboratoire. Avec des avancées technologiques continues et une recherche scientifique accrue, nous pouvons espérer résoudre certains de ces mystères de l'univers à l'avenir.")
      setvalue("L'univers est un lieu mystérieux et fascinant, rempli de phénomènes étranges et de questions sans réponse. Malgré des avancées considérables en astronomie et en physique, il reste encore beaucoup à découvrir sur l'univers et ses mystères.L'un des mystères les plus intrigants de l'univers est la question de la matière noire. Les scientifiques ont observé que la matière visible ne représente qu'une infime partie de la matière totale de l'univers, ce qui suggère l'existence d'une forme de matière invisible, la matière noire. Bien que les scientifiques aient des preuves indirectes de l'existence de la matière noire, ils ne savent pas encore exactement ce qu'elle est ni comment elle fonctionne.Un autre mystère de l'univers est la question de l'énergie noire. L'énergie noire est une forme d'énergie qui est censée être responsable de l'expansion accélérée de l'univers. Les scientifiques ne savent pas encore ce qu'est exactement l'énergie noire, mais ils pensent qu'elle représente environ 70% de l'univers.Un troisième mystère de l'univers est la question de l'origine de la vie et de son évolution dans l'univers. Les scientifiques ont découvert des milliers de planètes en dehors de notre système solaire qui pourraient être potentiellement habitables, mais ils ne savent pas encore comment la vie est apparue et s'est développée sur Terre, ni si elle s'est développée de la même manière ailleurs dans l'univers.Un autre mystère de l'univers est la question des trous noirs. Les trous noirs sont des zones de l'espace où la gravité est si intense que rien ne peut s'échapper, pas même la lumière. Les scientifiques cherchent encore à comprendre comment les trous noirs se forment, comment ils évoluent et comment ils affectent l'univers.En somme, l'univers est rempli de mystères et de questions sans réponse. Les scientifiques continuent de chercher des réponses à ces questions en utilisant des télescopes de pointe, des simulations informatiques et des expériences en laboratoire. Avec des avancées technologiques continues et une recherche scientifique accrue, nous pouvons espérer résoudre certains de ces mystères de l'univers à l'avenir.")
    } catch (error) {
      console.log(error);
    }
  }

  const addArticle = async () => {
    try {
      setAppear(false)
      let subject = refSubject.current.getElementsByTagName('input')[0].value
      const result = await axios.post('http://localhost:3000/article/addArticle', { subject: subject, content: value, token: Token })
      setvalidate(!validate)
      refSubject.current.getElementsByTagName('input')[0].value = ""
      contentRef.current.innerHTML = ""
    } catch (error) {
      console.log(error);
    }
  }

  const deleteArticle = async (id) => {
    try {
      const deleteResult = await axios.post('http://localhost:3000/article/deleteArticle', { id: id })
      setvalidate(!validate)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Add New Article
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-6 pt-0 pb-2">
          <Typography variant="h5" color="blue-gray" className="mb-1">
            Enter the subject
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500">
            let me know what subject you would like me to assist you with.
          </Typography>
          <div className="mr-auto my-6 flex flex-row justify-center items-center">
            <Input label="Type here" ref={refSubject} />
            <Link className="ml-2" >
              <Button variant="outlined" size="sm" onClick={() => { generateArticle() }}>
                Search
              </Button>
            </Link>
          </div>
          <div className="w-full border h-52 rounded-md overflow-y-scroll flex p-3">
            <p className="" ref={contentRef} >{content}</p>
            {appear &&
              <p className="animate-pulse h-5 w-1 bg-black" ></p>
            }
          </div>
          <div className="flex flex-row justify-end items-center">
            <Link className="mr-1 mt-3" onClick={() => { contentRef.current.innerHTML = ""; generateArticle() }}>
              <div className="icons8-refresh mr-4"></div>
            </Link>
            <Link className="mt-2">
              <Button variant="outlined" size="sm" onClick={() => { contentRef.current.innerHTML = ""; addArticle() }}>
                Validate
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Articles Table
          </Typography>
        </CardHeader>
        {(!_.isEmpty(formErrors["error"])) ?
          <div className="px-5 pb-5">
            <Alert
              color="orange"
              icon={
                <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
              }
            >
              Until now, no articles have been added. Could you please add one?
            </Alert>
          </div>
          :
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["subject", "content", "status", "date", ""].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              {Article != null &&
                <tbody>
                  {Article.map(
                    ({ id, subject, content, status, createdAt }, key) => {
                      const className = `py-3 px-5 ${key === Article.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                        }`;

                      return (
                        <tr key={id}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {subject}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500 h-10 w-96 flex items-center truncate" >
                              {content}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={(status == 1) ? "green" : "blue-gray"}
                              value={(status == 1) ? "converted" : "non-converted"}
                              className="py-0.5 px-2 text-[11px] font-medium"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {createdAt}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Button variant="text" size="sm" onClick={() => { deleteArticle(id) }}>
                              delete
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>}
            </table>
          </CardBody>
        }

      </Card>
      {/* <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["companies", "members", "budget", "completion", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
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
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Tables;