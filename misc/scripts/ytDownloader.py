# coding: utf-8

from pytube import YouTube
import os

#ask for the link from user
names = []
links = []


for link in links:

    yt = YouTube(link)
    #Showing details
    print("Title: ",yt.title)
    print("Number of views: ",yt.views)
    print("Length of video: ",yt.length)
    print("Rating of video: ",yt.rating)
    #Getting the highest resolution possible
    ys = yt.streams.filter(only_audio=True).first()

    #Starting download
    print("Downloading...")
    ys.download(output_path=f"/home/ninluc/Documents/codage/discord/Dat_Boi/sounds/")
    os.rename(f"/home/ninluc/Documents/codage/discord/Dat_Boi/sounds/{yt.title}.mp4", f"/home/ninluc/Documents/codage/discord/Dat_Boi/sounds/{yt.title}.mp3")
    print("Download completed!!")
    names.append(yt.title)

print(names)