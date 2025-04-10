PGDMP                         }           bms    15.4    15.4 :    ;           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            <           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            =           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            >           1262    16526    bms    DATABASE     w   CREATE DATABASE bms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Germany.1252';
    DROP DATABASE bms;
                postgres    false            �            1259    16600    ai_components    TABLE     �   CREATE TABLE public.ai_components (
    component_id integer NOT NULL,
    component_name character varying(50),
    component_description character varying(255)
);
 !   DROP TABLE public.ai_components;
       public         heap    postgres    false            �            1259    16599    ai_components_component_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ai_components_component_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.ai_components_component_id_seq;
       public          postgres    false    217            ?           0    0    ai_components_component_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.ai_components_component_id_seq OWNED BY public.ai_components.component_id;
          public          postgres    false    216            �            1259    16646    bias_component_association    TABLE     �   CREATE TABLE public.bias_component_association (
    link_id integer NOT NULL,
    component_id integer,
    bias_id integer
);
 .   DROP TABLE public.bias_component_association;
       public         heap    postgres    false            �            1259    16645    bias_component_link_link_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bias_component_link_link_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.bias_component_link_link_id_seq;
       public          postgres    false    223            @           0    0    bias_component_link_link_id_seq    SEQUENCE OWNED BY     j   ALTER SEQUENCE public.bias_component_link_link_id_seq OWNED BY public.bias_component_association.link_id;
          public          postgres    false    222            �            1259    16634    bias_reviews    TABLE     �   CREATE TABLE public.bias_reviews (
    review_id integer NOT NULL,
    submission_id integer,
    review_decision character varying(20)
);
     DROP TABLE public.bias_reviews;
       public         heap    postgres    false            �            1259    16633    bias_reviews_review_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bias_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.bias_reviews_review_id_seq;
       public          postgres    false    221            A           0    0    bias_reviews_review_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.bias_reviews_review_id_seq OWNED BY public.bias_reviews.review_id;
          public          postgres    false    220            �            1259    16607    biases    TABLE     K  CREATE TABLE public.biases (
    bias_id integer NOT NULL,
    bias_type character varying(50) NOT NULL,
    bias_source character varying(50),
    bias_description character varying(1000),
    severity_score character varying(20),
    affected_groups character varying(100),
    m_strategy_id integer,
    submitted_by integer
);
    DROP TABLE public.biases;
       public         heap    postgres    false            �            1259    16606    biases_bias_id_seq    SEQUENCE     �   CREATE SEQUENCE public.biases_bias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.biases_bias_id_seq;
       public          postgres    false    219            B           0    0    biases_bias_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.biases_bias_id_seq OWNED BY public.biases.bias_id;
          public          postgres    false    218            �            1259    16704    mitigation_strategies    TABLE     �   CREATE TABLE public.mitigation_strategies (
    mitigation_strategy_id integer NOT NULL,
    bias_id integer,
    m_strategy_description character varying(1000)
);
 )   DROP TABLE public.mitigation_strategies;
       public         heap    postgres    false            �            1259    16703 0   mitigation_strategies_mitigation_strategy_id_seq    SEQUENCE     �   CREATE SEQUENCE public.mitigation_strategies_mitigation_strategy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 G   DROP SEQUENCE public.mitigation_strategies_mitigation_strategy_id_seq;
       public          postgres    false    227            C           0    0 0   mitigation_strategies_mitigation_strategy_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.mitigation_strategies_mitigation_strategy_id_seq OWNED BY public.mitigation_strategies.mitigation_strategy_id;
          public          postgres    false    226            �            1259    16667    pending_biases    TABLE     k  CREATE TABLE public.pending_biases (
    bias_request_id integer NOT NULL,
    bias_type character varying(50),
    bias_source character varying(50),
    bias_description character varying(1000),
    severity_score character varying(20),
    affected_groups character varying(100),
    submitted_by integer,
    m_strategy_description character varying(1000)
);
 "   DROP TABLE public.pending_biases;
       public         heap    postgres    false            �            1259    16666 )   pending_bias_requests_bias_request_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pending_bias_requests_bias_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 @   DROP SEQUENCE public.pending_bias_requests_bias_request_id_seq;
       public          postgres    false    225            D           0    0 )   pending_bias_requests_bias_request_id_seq    SEQUENCE OWNED BY     p   ALTER SEQUENCE public.pending_bias_requests_bias_request_id_seq OWNED BY public.pending_biases.bias_request_id;
          public          postgres    false    224            �            1259    16528    users    TABLE     �   CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_name character varying(10) NOT NULL,
    password character varying(50) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16527    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    215            E           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    214            �           2604    16603    ai_components component_id    DEFAULT     �   ALTER TABLE ONLY public.ai_components ALTER COLUMN component_id SET DEFAULT nextval('public.ai_components_component_id_seq'::regclass);
 I   ALTER TABLE public.ai_components ALTER COLUMN component_id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    16649 "   bias_component_association link_id    DEFAULT     �   ALTER TABLE ONLY public.bias_component_association ALTER COLUMN link_id SET DEFAULT nextval('public.bias_component_link_link_id_seq'::regclass);
 Q   ALTER TABLE public.bias_component_association ALTER COLUMN link_id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    16637    bias_reviews review_id    DEFAULT     �   ALTER TABLE ONLY public.bias_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.bias_reviews_review_id_seq'::regclass);
 E   ALTER TABLE public.bias_reviews ALTER COLUMN review_id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16610    biases bias_id    DEFAULT     p   ALTER TABLE ONLY public.biases ALTER COLUMN bias_id SET DEFAULT nextval('public.biases_bias_id_seq'::regclass);
 =   ALTER TABLE public.biases ALTER COLUMN bias_id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16707 ,   mitigation_strategies mitigation_strategy_id    DEFAULT     �   ALTER TABLE ONLY public.mitigation_strategies ALTER COLUMN mitigation_strategy_id SET DEFAULT nextval('public.mitigation_strategies_mitigation_strategy_id_seq'::regclass);
 [   ALTER TABLE public.mitigation_strategies ALTER COLUMN mitigation_strategy_id DROP DEFAULT;
       public          postgres    false    226    227    227            �           2604    16670    pending_biases bias_request_id    DEFAULT     �   ALTER TABLE ONLY public.pending_biases ALTER COLUMN bias_request_id SET DEFAULT nextval('public.pending_bias_requests_bias_request_id_seq'::regclass);
 M   ALTER TABLE public.pending_biases ALTER COLUMN bias_request_id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    16531    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    215    214    215            .          0    16600    ai_components 
   TABLE DATA           \   COPY public.ai_components (component_id, component_name, component_description) FROM stdin;
    public          postgres    false    217   $I       4          0    16646    bias_component_association 
   TABLE DATA           T   COPY public.bias_component_association (link_id, component_id, bias_id) FROM stdin;
    public          postgres    false    223    J       2          0    16634    bias_reviews 
   TABLE DATA           Q   COPY public.bias_reviews (review_id, submission_id, review_decision) FROM stdin;
    public          postgres    false    221   FJ       0          0    16607    biases 
   TABLE DATA           �   COPY public.biases (bias_id, bias_type, bias_source, bias_description, severity_score, affected_groups, m_strategy_id, submitted_by) FROM stdin;
    public          postgres    false    219   cJ       8          0    16704    mitigation_strategies 
   TABLE DATA           h   COPY public.mitigation_strategies (mitigation_strategy_id, bias_id, m_strategy_description) FROM stdin;
    public          postgres    false    227   �L       6          0    16667    pending_biases 
   TABLE DATA           �   COPY public.pending_biases (bias_request_id, bias_type, bias_source, bias_description, severity_score, affected_groups, submitted_by, m_strategy_description) FROM stdin;
    public          postgres    false    225   �M       ,          0    16528    users 
   TABLE DATA           =   COPY public.users (user_id, user_name, password) FROM stdin;
    public          postgres    false    215   .N       F           0    0    ai_components_component_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.ai_components_component_id_seq', 10, true);
          public          postgres    false    216            G           0    0    bias_component_link_link_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.bias_component_link_link_id_seq', 9, true);
          public          postgres    false    222            H           0    0    bias_reviews_review_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.bias_reviews_review_id_seq', 1, false);
          public          postgres    false    220            I           0    0    biases_bias_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.biases_bias_id_seq', 29, true);
          public          postgres    false    218            J           0    0 0   mitigation_strategies_mitigation_strategy_id_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.mitigation_strategies_mitigation_strategy_id_seq', 22, true);
          public          postgres    false    226            K           0    0 )   pending_bias_requests_bias_request_id_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.pending_bias_requests_bias_request_id_seq', 20, true);
          public          postgres    false    224            L           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 11, true);
          public          postgres    false    214            �           2606    16605     ai_components ai_components_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.ai_components
    ADD CONSTRAINT ai_components_pkey PRIMARY KEY (component_id);
 J   ALTER TABLE ONLY public.ai_components DROP CONSTRAINT ai_components_pkey;
       public            postgres    false    217            �           2606    16651 3   bias_component_association bias_component_link_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.bias_component_association
    ADD CONSTRAINT bias_component_link_pkey PRIMARY KEY (link_id);
 ]   ALTER TABLE ONLY public.bias_component_association DROP CONSTRAINT bias_component_link_pkey;
       public            postgres    false    223            �           2606    16639    bias_reviews bias_reviews_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.bias_reviews
    ADD CONSTRAINT bias_reviews_pkey PRIMARY KEY (review_id);
 H   ALTER TABLE ONLY public.bias_reviews DROP CONSTRAINT bias_reviews_pkey;
       public            postgres    false    221            �           2606    16612    biases biases_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.biases
    ADD CONSTRAINT biases_pkey PRIMARY KEY (bias_id);
 <   ALTER TABLE ONLY public.biases DROP CONSTRAINT biases_pkey;
       public            postgres    false    219            �           2606    16709 0   mitigation_strategies mitigation_strategies_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.mitigation_strategies
    ADD CONSTRAINT mitigation_strategies_pkey PRIMARY KEY (mitigation_strategy_id);
 Z   ALTER TABLE ONLY public.mitigation_strategies DROP CONSTRAINT mitigation_strategies_pkey;
       public            postgres    false    227            �           2606    16672 )   pending_biases pending_bias_requests_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.pending_biases
    ADD CONSTRAINT pending_bias_requests_pkey PRIMARY KEY (bias_request_id);
 S   ALTER TABLE ONLY public.pending_biases DROP CONSTRAINT pending_bias_requests_pkey;
       public            postgres    false    225            �           2606    16533    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215            �           2606    16657 ;   bias_component_association bias_component_link_bias_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bias_component_association
    ADD CONSTRAINT bias_component_link_bias_id_fkey FOREIGN KEY (bias_id) REFERENCES public.biases(bias_id);
 e   ALTER TABLE ONLY public.bias_component_association DROP CONSTRAINT bias_component_link_bias_id_fkey;
       public          postgres    false    3215    223    219            �           2606    16652 @   bias_component_association bias_component_link_component_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bias_component_association
    ADD CONSTRAINT bias_component_link_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.ai_components(component_id);
 j   ALTER TABLE ONLY public.bias_component_association DROP CONSTRAINT bias_component_link_component_id_fkey;
       public          postgres    false    3213    223    217            �           2606    16683    biases biases_submitted_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.biases
    ADD CONSTRAINT biases_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(user_id);
 I   ALTER TABLE ONLY public.biases DROP CONSTRAINT biases_submitted_by_fkey;
       public          postgres    false    3211    215    219            �           2606    16710 8   mitigation_strategies mitigation_strategies_bias_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.mitigation_strategies
    ADD CONSTRAINT mitigation_strategies_bias_id_fkey FOREIGN KEY (bias_id) REFERENCES public.biases(bias_id);
 b   ALTER TABLE ONLY public.mitigation_strategies DROP CONSTRAINT mitigation_strategies_bias_id_fkey;
       public          postgres    false    219    227    3215            �           2606    16673 5   pending_biases pending_bias_requests_submittedby_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pending_biases
    ADD CONSTRAINT pending_bias_requests_submittedby_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(user_id);
 _   ALTER TABLE ONLY public.pending_biases DROP CONSTRAINT pending_bias_requests_submittedby_fkey;
       public          postgres    false    3211    215    225            .   �   x�MO�N1��_�@�@��Ф@W�,�c��J뽠�=�(T��C3��,(eLT�H�1��Ta���`M)�X���*��Ė)�F�gw����ѢJ��Q�`?��
�.R��'�l����=B����{���oVÕH5��+s�Z@�1�if����R��N�G�N\�y���g?�n�_���l���R�.Q����u���\/      4   6   x����0����L([W/鿎 �xt8�uI"�Q*��j��%R�_��=�~tI      2      x������ � �      0     x����r�@����4��iZ8��M:Ӧ�L/�[�]FZ �}��	8io=avW�?�FcwM�&�)��۳F����`C�ƚ���4�DO	v���4�PL�5���f��9ph�3&|3���o�X\�F#7)F�+FP��a�&qvtK�~�.�J�CVZ)����L=V+�P��z�o�MU)�+�
�k�om��ʣ*/�č.�,8����{V2I9<2E�ϊ���2��
�(EHK�k�V��??2����=�<Cb��԰�XQ_YO����o=�-9z���`.�:��(Vc��}�bK�[S\[�%���r��IϨ�M�N䔺�������-g�oXS��K���-�{��k�C�B�IH�P�&�rXx�AXW�v�3�m�c8�(�m��d���v6�㢼������l�A��g��k���)�ƨ��{!Kx'�i[ƹ�vqX;��$_3�%+������P���V;<�<M}��N��M�n���~��.6է�^۵ak2�v�	�\�����$��EQ�#��U      8   �   x����N1�g�)� '�D�ҵ�:��9ߝ!�TNRԷ'� BBb��Y��=�g8�$U6�y����h|�t~~G����G�R�:��T�1�R蜺��B����F;q���O)��Ái�qJGIL�<��e%���;�p2�r!�^ZY\�ȩ�~�X%+�b��jq�1l���Cx�W�[����F�5"f-�H�?;8��=�J&=�1.�s/�,�/kF��Q)��y,���9��N�      6   �   x�M�1
AE��)��[ں�6Zhkf���1Y�Q���������f�Lw��5%�<���9a�M��>�����c�����&I���)9�@�↓/��$v_k4������ ׿y�L���Y�)G,�֘��)&�q�ܖ!�7X�D      ,   4   x���LL��̃��F�\��%��%�ũE`H�� !h�5D��Ec���� �6�     