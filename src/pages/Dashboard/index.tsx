import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import { Title, Form, Error, Videos, CircularBox } from './styles';

const timeWatchVideo = ['15', '20', '30', '40', '90', '120', '150'];

interface Video {
  items: [
    {
      id: {
        videoId: string;
      };
      snippet: {
        title: string;
        description: string;
        thumbnails: {
          default: {
            url: string;
          };
        };
      };
    },
  ];
  fiveMostUsedWords: [
    {
      word: string;
      repetitionNumber: number;
    },
  ];
  daysWeekWatchMovie: [
    {
      dayWeek: string;
      videoIds: string[];
    },
  ];
}

const Dashboard: React.FC = () => {
  const [newSearch, setNewSearch] = useState('');
  const [inputError, setInputError] = useState('');
  const [videos, setVideos] = useState<Video>();

  async function handleVideos(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!newSearch) {
      setInputError('Digite um termo.');
      return;
    }

    try {
      const response = await api.get<Video>(`search?term=${newSearch}`);

      const video = response.data;

      setVideos(video);
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse termo.');
    }
  }

  async function handleClick(e: any) {
    const dailyTime = e.target.id;

    console.log(newSearch);

    try {
      const response = await api.get<Video>(
        `search?term=${newSearch}&dailyTime=${dailyTime}`,
      );

      const video = response.data;

      setVideos(video);
      setInputError('');
    } catch (err) {
      setInputError(
        `Não foi possível organizar os vídeos com disponibilidade diária de ${dailyTime} minutos.`,
      );
    }
  }

  return (
    <>
      <img src={logoImg} alt="GitHub Explorer" />
      <Title>Explore vídeos no Youtube</Title>
      <Form hasError={!!inputError} onSubmit={handleVideos}>
        <input
          value={newSearch}
          onChange={e => setNewSearch(e.target.value)}
          placeholder="Digite um termo para buscar"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <CircularBox>
        {videos?.items && <p>Disponibilidade diaria (minutos)</p>}
        {videos?.items &&
          timeWatchVideo.map(value => (
            <ul>
              <li onClick={handleClick} id={value}>
                {value}
              </li>
            </ul>
          ))}
      </CircularBox>
      <CircularBox>
        {videos?.fiveMostUsedWords && <p>Palavras mais frequentes</p>}
        {videos?.fiveMostUsedWords.map(value => (
          <ul>
            <li>
              {value.word} <strong>({value.repetitionNumber})</strong>
            </li>
          </ul>
        ))}
      </CircularBox>
      <Videos>
        {videos?.daysWeekWatchMovie?.map((item, index) => (
          <>
            <h2>{item.dayWeek}</h2>
            {videos?.items.map(value => {
              if (item.videoIds.includes(value.id.videoId))
                return (
                  <Link
                    to={{
                      pathname: `https://www.youtube.com/watch?v={value.id.videoId}`,
                    }}
                    target="_blank"
                  >
                    <img src={value.snippet.thumbnails.default.url} alt="123" />
                    <div>
                      <strong>{value.snippet.title}</strong>
                      <p>{value.snippet.description}</p>
                    </div>
                    <FiChevronRight size={20} />
                  </Link>
                );
            })}
          </>
        ))}
      </Videos>
      <Videos>
        {!videos?.daysWeekWatchMovie &&
          videos?.items.map(value => (
            <Link
              to={{
                pathname: `https://www.youtube.com/watch?v={value.id.videoId}`,
              }}
              target="_blank"
            >
              <img src={value.snippet.thumbnails.default.url} alt="123" />
              <div>
                <strong>{value.snippet.title}</strong>
                <p>{value.snippet.description}</p>
              </div>
              <FiChevronRight size={20} />
            </Link>
          ))}
      </Videos>
    </>
  );
};

export default Dashboard;
