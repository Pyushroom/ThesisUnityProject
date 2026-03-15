-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 07 Maj 2023, 15:24
-- Wersja serwera: 10.4.25-MariaDB
-- Wersja PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `websitedb`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `access`
--

CREATE TABLE `access` (
  `team_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `assigments`
--

CREATE TABLE `assigments` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `team_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `creation_date` datetime NOT NULL,
  `deadline_date` datetime NOT NULL,
  `image` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `assigments`
--

INSERT INTO `assigments` (`id`, `name`, `description`, `team_id`, `quiz_id`, `exercise_id`, `creation_date`, `deadline_date`, `image`) VALUES
(5, 'Assigment 1', 'Some description of the exercise that will be performed ', 1, 1, 1, '2023-04-05 00:58:59', '2023-04-04 22:59:00', 'basic'),
(6, 'Assigment 2', 'Basic operations of laser and interaction with different elements', 2, 2, 2, '2023-04-06 00:59:15', '2023-04-24 06:00:15', 'basic'),
(8, 'Assigment 4', '', 3, 1, 2, '2023-04-04 01:00:00', '2023-04-20 01:00:00', 'basic'),
(10, 'Assigment 6', '', 2, 2, 2, '2023-04-05 01:01:27', '2023-04-18 01:01:27', 'basic');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `assigments_members`
--

CREATE TABLE `assigments_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `assigment_id` int(11) NOT NULL,
  `isquizdone` tinyint(1) NOT NULL,
  `isexercisedone` tinyint(1) NOT NULL,
  `finisheddate` datetime DEFAULT NULL,
  `isdone` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `assigments_members`
--

INSERT INTO `assigments_members` (`id`, `user_id`, `assigment_id`, `isquizdone`, `isexercisedone`, `finisheddate`, `isdone`) VALUES
(32, 25, 5, 0, 0, NULL, 0),
(33, 42, 5, 1, 0, NULL, 0),
(34, 48, 5, 0, 0, NULL, 0),
(35, 42, 6, 1, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `exercise1`
--

CREATE TABLE `exercise1` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `assigment_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `resultsRefract` text NOT NULL,
  `isSorted` tinyint(1) NOT NULL,
  `isTargetHit` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `exercise1`
--

INSERT INTO `exercise1` (`id`, `user_id`, `assigment_id`, `exercise_id`, `resultsRefract`, `isSorted`, `isTargetHit`) VALUES
(1, 42, 5, 1, 'sdadawdsdawdwadasdawdasdsadwadsd', 0, 0),
(2, 42, 5, 1, 'sdadawdsdawdwadasdawdasdsadwadsd', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `exercises`
--

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `exercises`
--

INSERT INTO `exercises` (`id`, `name`, `description`) VALUES
(1, 'Laboratory Exercise 1', 'This exercise show basic principles of optic. It allow user to observe different equipment and do some basic work. '),
(2, 'Laboratory Exercise 2', 'Second exercise from optic lab. It is about different optical system. ');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `creation_date` datetime NOT NULL,
  `person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `creation_date`, `person_id`) VALUES
(9, 'Patch note 0.0.1 Test of notification system', 'Basic setup of website with Unity application. Checking for any errors', '2023-04-19 12:31:55', 42);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `quizz_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answeara` text NOT NULL,
  `answearb` text NOT NULL,
  `answearc` text NOT NULL,
  `answeard` text NOT NULL,
  `correctAnswers` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `questions`
--

INSERT INTO `questions` (`id`, `quizz_id`, `question`, `answeara`, `answearb`, `answearc`, `answeard`, `correctAnswers`) VALUES
(1, 1, 'what is red ', 'apple', 'banana', 'orange', 'blueberry', 'answearA'),
(73, 51, 'a', 'aa', 'aaa', 'aaa', 'aaaa', 'AnswearA'),
(74, 51, 'aa', 'aaa', 'aaaa', 'aaaa', 'aaaa', 'AnswearA/AnswearC/AnswearD'),
(75, 51, 'ww', 'www', 'wwww', 'wwww', 'wwww', 'AnswearA/AnswearD'),
(76, 52, 'ww', 'www', 'ww', 'w', 'wwww', 'AnswearA/AnswearD'),
(79, 2, 'What should you work during work with laser?', 'Glasses', 'Gloves', 'Cap', 'Hoodie', 'AnswearA'),
(80, 2, 'What you shouldn\'t do during lab? ', 'run', 'eat', 'learn', 'listen', 'AnswearA/AnswearB'),
(86, 1, 'Which one is an animal? ', 'Cow', 'Ant', 'Jellyfish', 'Owl', 'AnswearA');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `creator_id` int(11) NOT NULL,
  `isdone` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `quizzes`
--

INSERT INTO `quizzes` (`id`, `name`, `description`, `creator_id`, `isdone`) VALUES
(1, 'Basic of photonic', 'Basic optic equipment', 42, 1),
(2, 'Laboratory rules', 'Basic rules of conducting laboratory exercise', 42, 1),
(51, 'Laboratory 2 test', 'Description of laboratory 2 and what to expect ', 24, 1),
(52, 'Basic principles', 'What should you knwo about lab?', 24, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quizz_results`
--

CREATE TABLE `quizz_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quizz_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_answear` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `quizz_results`
--

INSERT INTO `quizz_results` (`id`, `user_id`, `quizz_id`, `question_id`, `user_answear`) VALUES
(22, 42, 1, 1, '[0,1]'),
(24, 42, 1, 1, '[1,2]'),
(26, 42, 1, 1, '[2,1]'),
(31, 42, 2, 80, '[3]'),
(32, 42, 1, 1, '[2]'),
(34, 42, 2, 79, '[1]'),
(35, 42, 1, 1, '[2]'),
(37, 42, 2, 79, '[0,1,3]'),
(38, 42, 2, 80, '[1,0]'),
(40, 42, 2, 79, '[0]'),
(41, 42, 2, 80, '[0,1]'),
(42, 42, 1, 1, '[2]'),
(44, 42, 2, 79, '[2]'),
(45, 42, 2, 80, '[2]'),
(46, 42, 1, 1, '[1]'),
(48, 42, 2, 79, '[3]'),
(49, 42, 2, 80, '[3]'),
(50, 42, 1, 1, '[1]'),
(51, 42, 1, 1, '[1]'),
(53, 42, 2, 79, '[0]'),
(54, 42, 2, 80, '[2]'),
(55, 42, 2, 79, '[1,0]'),
(56, 42, 2, 80, '[0,1]'),
(57, 42, 2, 79, '[0,1]'),
(58, 42, 2, 80, '[0,1]'),
(59, 42, 2, 79, '[0,1]'),
(60, 42, 2, 80, '[1,2]');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teammembers`
--

CREATE TABLE `teammembers` (
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `isadmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `teammembers`
--

INSERT INTO `teammembers` (`user_id`, `team_id`, `isadmin`) VALUES
(42, 1, 0),
(42, 2, 1),
(42, 3, 1),
(42, 6, 1),
(25, 4, 0),
(25, 1, 0),
(48, 1, 0),
(49, 1, 0),
(50, 1, 1),
(51, 1, 0),
(52, 1, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teammessage`
--

CREATE TABLE `teammessage` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `creationdate` datetime NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `team_code` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `teams`
--

INSERT INTO `teams` (`id`, `name`, `team_code`) VALUES
(1, 'MEMS', '321'),
(2, 'MXIFO-161', '123'),
(3, 'MTMX-141', '1234'),
(4, 'MTIFO-161 ', '4321'),
(5, 'Basic Optic Lab', '12345'),
(6, 'MTMX-121 ', '54321');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `status` int(3) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `verification_code` varchar(16) NOT NULL,
  `isverify` tinyint(1) NOT NULL,
  `failed_login_attempts` int(11) NOT NULL,
  `lockout_until` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `ip`, `verification_code`, `isverify`, `failed_login_attempts`, `lockout_until`) VALUES
(25, 'mark_Thomas', 'test13@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '', '1hWEDI', 1, 0, '0000-00-00 00:00:00'),
(42, 'test14', 'artur6550@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$Y7w+88B36W4h3OZmDIC4yg$3ayNR13SNfrfgn5D6oCs9xhHCnu5kz+0zz3ylmrwlnY', 1, '127.0.0.1', 'oFcqgX', 1, 0, '0000-00-00 00:00:00'),
(47, 'JohnMike', 'test16@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '', '', 1, 0, '2023-04-30 19:06:48'),
(48, 'test17', 'test17@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '127.0.0.1', '32Ec23', 1, 0, '2023-04-30 19:08:05'),
(49, 'test18', 'test18@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '127.0.0.1', 'rr43e5', 1, 0, '2023-04-30 19:08:05'),
(50, 'test19', 'test19@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '127.0.0.1', 'rr43tt', 1, 0, '2023-04-30 19:09:18'),
(51, 'test20', 'test20@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '127.0.0.1', 'rr45ee', 1, 0, '2023-04-30 19:09:44'),
(52, 'test21', 'test21@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$4upsO0NNn/yCwhUPZcb70Q$x3FI4dbg2Ux2vJRnSWEDdK9gX0QttdQnI3uD1IDaIV4', 0, '127.0.0.1', 'ee45hh', 1, 0, '2023-04-30 19:09:44'),
(53, 'johnSmith2', 'artur0556@wp.pl', '$argon2id$v=19$m=65536,t=3,p=4$f5+UQFypSZRz2Ul+RdVCnA$v49Ip3sXWbKwkQ9aRHXjsJiaejWr2NrKExzkvsGw+w8', 0, '', 'HTS5yq', 1, 0, '0000-00-00 00:00:00');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `access`
--
ALTER TABLE `access`
  ADD KEY `team_id` (`team_id`,`exercise_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indeksy dla tabeli `assigments`
--
ALTER TABLE `assigments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `exercise_id` (`exercise_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indeksy dla tabeli `assigments_members`
--
ALTER TABLE `assigments_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`assigment_id`),
  ADD KEY `assigment_id` (`assigment_id`);

--
-- Indeksy dla tabeli `exercise1`
--
ALTER TABLE `exercise1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`exercise_id`),
  ADD KEY `exercise_id` (`exercise_id`),
  ADD KEY `assigment_id` (`assigment_id`);

--
-- Indeksy dla tabeli `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indeksy dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizz_id` (`quizz_id`);

--
-- Indeksy dla tabeli `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Indeksy dla tabeli `quizz_results`
--
ALTER TABLE `quizz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`quizz_id`,`question_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `quizz_id` (`quizz_id`);

--
-- Indeksy dla tabeli `teammembers`
--
ALTER TABLE `teammembers`
  ADD KEY `user_id` (`user_id`,`team_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indeksy dla tabeli `teammessage`
--
ALTER TABLE `teammessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`,`person_id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indeksy dla tabeli `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `assigments`
--
ALTER TABLE `assigments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT dla tabeli `assigments_members`
--
ALTER TABLE `assigments_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT dla tabeli `exercise1`
--
ALTER TABLE `exercise1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT dla tabeli `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT dla tabeli `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT dla tabeli `quizz_results`
--
ALTER TABLE `quizz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT dla tabeli `teammessage`
--
ALTER TABLE `teammessage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `access`
--
ALTER TABLE `access`
  ADD CONSTRAINT `access_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `access_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE;

--
-- Ograniczenia dla tabeli `assigments`
--
ALTER TABLE `assigments`
  ADD CONSTRAINT `assigments_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assigments_ibfk_3` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assigments_ibfk_4` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

--
-- Ograniczenia dla tabeli `assigments_members`
--
ALTER TABLE `assigments_members`
  ADD CONSTRAINT `assigments_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assigments_members_ibfk_3` FOREIGN KEY (`assigment_id`) REFERENCES `assigments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `exercise1`
--
ALTER TABLE `exercise1`
  ADD CONSTRAINT `exercise1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercise1_ibfk_3` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercise1_ibfk_4` FOREIGN KEY (`assigment_id`) REFERENCES `assigments` (`id`);

--
-- Ograniczenia dla tabeli `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ograniczenia dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quizz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `quizz_results`
--
ALTER TABLE `quizz_results`
  ADD CONSTRAINT `quizz_results_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quizz_results_ibfk_2` FOREIGN KEY (`quizz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quizz_results_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `teammembers`
--
ALTER TABLE `teammembers`
  ADD CONSTRAINT `teammembers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teammembers_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

--
-- Ograniczenia dla tabeli `teammessage`
--
ALTER TABLE `teammessage`
  ADD CONSTRAINT `teammessage_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teammessage_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
